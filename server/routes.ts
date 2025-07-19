import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDidSchema, insertNotarizedDocumentSchema } from "@shared/schema";
import { cyberVaultSDK } from "./iota-sdk";

export async function registerRoutes(app: Express): Promise<Server> {
  // DID routes
  app.get("/api/dids", async (req, res) => {
    try {
      const dids = await storage.getAllDids();
      res.json(dids);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch DIDs" });
    }
  });

  app.post("/api/dids", async (req, res) => {
    try {
      const validatedData = insertDidSchema.parse(req.body);
      
      // Check if DID already exists in local storage
      const existingDid = await storage.getDidByValue(validatedData.did);
      if (existingDid) {
        return res.status(400).json({ message: "DID already exists" });
      }

      // Step 1: Register DID on IOTA blockchain
      const registrationResult = await cyberVaultSDK.registerDID(validatedData.did);
      if (!registrationResult.success) {
        return res.status(500).json({ 
          message: "Failed to register DID on blockchain", 
          error: registrationResult.error 
        });
      }

      // Step 2: Bind DID to wallet address on IOTA blockchain
      const bindingResult = await cyberVaultSDK.bindDIDToWallet(
        validatedData.did, 
        validatedData.walletAddress
      );
      if (!bindingResult.success) {
        console.error("DID binding failed:", bindingResult.error);
        // Continue with local storage even if binding fails
      }

      // Step 3: Store in local database with blockchain transaction info
      const didData = {
        ...validatedData,
        blockchainTxHash: registrationResult.data?.transactionHash,
        bindingTxHash: bindingResult.data?.transactionHash,
        onChain: true
      };

      const newDid = await storage.createDid(didData);
      
      res.status(201).json({
        ...newDid,
        blockchain: {
          registered: registrationResult.success,
          bound: bindingResult.success,
          registrationTx: registrationResult.data?.transactionHash,
          bindingTx: bindingResult.data?.transactionHash
        }
      });
    } catch (error) {
      console.error("DID creation error:", error);
      res.status(400).json({ message: "Invalid DID data or blockchain error" });
    }
  });

  app.patch("/api/dids/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }

      const updatedDid = await storage.updateDidStatus(id, status);
      if (!updatedDid) {
        return res.status(404).json({ message: "DID not found" });
      }

      res.json(updatedDid);
    } catch (error) {
      res.status(500).json({ message: "Failed to update DID status" });
    }
  });

  // Notarized document routes
  app.get("/api/documents", async (req, res) => {
    try {
      const documents = await storage.getAllNotarizedDocuments();
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  app.post("/api/documents", async (req, res) => {
    try {
      const validatedData = insertNotarizedDocumentSchema.parse(req.body);
      
      // Check if document hash already exists
      const existingDoc = await storage.getNotarizedDocumentByHash(validatedData.hash);
      if (existingDoc) {
        return res.status(400).json({ message: "Document hash already notarized" });
      }

      // Notarize on IOTA blockchain using the SDK
      const notarizationResult = await cyberVaultSDK.notarizeDocument(
        validatedData.hash, 
        validatedData.timestamp.toString()
      );
      
      if (!notarizationResult.success) {
        return res.status(500).json({ 
          message: "Failed to notarize document on blockchain", 
          error: notarizationResult.error 
        });
      }

      // Store in local database with blockchain transaction info
      const docData = {
        ...validatedData,
        blockchainTxHash: notarizationResult.data?.transactionHash,
        blockchainTimestamp: notarizationResult.data?.blockchainTimestamp,
        onChain: true
      };

      const newDoc = await storage.createNotarizedDocument(docData);
      
      res.status(201).json({
        ...newDoc,
        blockchain: {
          notarized: notarizationResult.success,
          transactionHash: notarizationResult.data?.transactionHash,
          blockchainTimestamp: notarizationResult.data?.blockchainTimestamp
        }
      });
    } catch (error) {
      console.error("Document notarization error:", error);
      res.status(400).json({ message: "Invalid document data or blockchain error" });
    }
  });

  app.get("/api/documents/verify/:hash", async (req, res) => {
    try {
      const hash = req.params.hash;
      
      // First check local storage
      const document = await storage.getNotarizedDocumentByHash(hash);
      
      if (document) {
        // If found locally, also verify on blockchain
        const blockchainVerification = await cyberVaultSDK.verifyDocument(hash);
        
        res.json({ 
          verified: true, 
          document: {
            ...document,
            onChain: blockchainVerification.success,
            blockchainVerified: blockchainVerification.success
          }
        });
      } else {
        // Try blockchain verification even if not in local storage
        const blockchainVerification = await cyberVaultSDK.verifyDocument(hash);
        
        if (blockchainVerification.success && blockchainVerification.data?.verified) {
          res.json({ 
            verified: true, 
            document: {
              hash,
              onChainOnly: true,
              blockchainVerified: true
            }
          });
        } else {
          res.json({ 
            verified: false, 
            message: "Document not found in blockchain records" 
          });
        }
      }
    } catch (error) {
      console.error("Document verification error:", error);
      res.status(500).json({ message: "Failed to verify document" });
    }
  });

  app.get("/api/documents/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }

      const documents = await storage.searchNotarizedDocuments(query);
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Failed to search documents" });
    }
  });

  // IOTA CLI status endpoint
  app.get("/api/iota/status", async (req, res) => {
    try {
      const isAvailable = await cyberVaultSDK.checkCLIAvailability();
      res.json({ 
        cliAvailable: isAvailable,
        status: isAvailable ? 'ready' : 'unavailable',
        message: isAvailable ? 'CyberVault CLI is ready' : 'Cargo/CLI not found - please ensure Rust and CyberVault CLI are installed'
      });
    } catch (error) {
      res.status(500).json({ 
        cliAvailable: false, 
        status: 'error',
        message: "Failed to check CLI status" 
      });
    }
  });

  // Stats endpoint
  app.get("/api/stats", async (req, res) => {
    try {
      const dids = await storage.getAllDids();
      const documents = await storage.getAllNotarizedDocuments();
      
      const stats = {
        registeredDids: dids.length,
        notarizedDocuments: documents.length,
        verifications: documents.length * 2, // Mock verification count
        storageUsed: (documents.length * 0.05).toFixed(1), // Mock storage in GB
        blockchainConnected: await cyberVaultSDK.checkCLIAvailability()
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
