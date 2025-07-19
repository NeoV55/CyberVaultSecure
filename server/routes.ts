import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDidSchema, insertNotarizedDocumentSchema } from "@shared/schema";

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
      
      // Check if DID already exists
      const existingDid = await storage.getDidByValue(validatedData.did);
      if (existingDid) {
        return res.status(400).json({ message: "DID already exists" });
      }

      const newDid = await storage.createDid(validatedData);
      res.status(201).json(newDid);
    } catch (error) {
      res.status(400).json({ message: "Invalid DID data" });
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

      const newDoc = await storage.createNotarizedDocument(validatedData);
      res.status(201).json(newDoc);
    } catch (error) {
      res.status(400).json({ message: "Invalid document data" });
    }
  });

  app.get("/api/documents/verify/:hash", async (req, res) => {
    try {
      const hash = req.params.hash;
      const document = await storage.getNotarizedDocumentByHash(hash);
      
      if (document) {
        res.json({ 
          verified: true, 
          document 
        });
      } else {
        res.json({ 
          verified: false, 
          message: "Document not found in blockchain records" 
        });
      }
    } catch (error) {
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

  // Stats endpoint
  app.get("/api/stats", async (req, res) => {
    try {
      const dids = await storage.getAllDids();
      const documents = await storage.getAllNotarizedDocuments();
      
      const stats = {
        registeredDids: dids.length,
        notarizedDocuments: documents.length,
        verifications: documents.length * 2, // Mock verification count
        storageUsed: (documents.length * 0.05).toFixed(1) // Mock storage in GB
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
