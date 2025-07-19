import { users, type User, type InsertUser, dids, type Did, type InsertDid, notarizedDocuments, type NotarizedDocument, type InsertNotarizedDocument } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // DID operations
  getAllDids(): Promise<Did[]>;
  getDidById(id: number): Promise<Did | undefined>;
  getDidByValue(did: string): Promise<Did | undefined>;
  createDid(did: InsertDid): Promise<Did>;
  updateDidStatus(id: number, status: string): Promise<Did | undefined>;
  
  // Notarized document operations
  getAllNotarizedDocuments(): Promise<NotarizedDocument[]>;
  getNotarizedDocumentById(id: number): Promise<NotarizedDocument | undefined>;
  getNotarizedDocumentByHash(hash: string): Promise<NotarizedDocument | undefined>;
  createNotarizedDocument(doc: InsertNotarizedDocument): Promise<NotarizedDocument>;
  searchNotarizedDocuments(query: string): Promise<NotarizedDocument[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private dids: Map<number, Did>;
  private notarizedDocuments: Map<number, NotarizedDocument>;
  private currentUserId: number;
  private currentDidId: number;
  private currentDocId: number;

  constructor() {
    this.users = new Map();
    this.dids = new Map();
    this.notarizedDocuments = new Map();
    this.currentUserId = 1;
    this.currentDidId = 1;
    this.currentDocId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllDids(): Promise<Did[]> {
    return Array.from(this.dids.values()).sort((a, b) => b.createdAt - a.createdAt);
  }

  async getDidById(id: number): Promise<Did | undefined> {
    return this.dids.get(id);
  }

  async getDidByValue(did: string): Promise<Did | undefined> {
    return Array.from(this.dids.values()).find(d => d.did === did);
  }

  async createDid(insertDid: InsertDid): Promise<Did> {
    const id = this.currentDidId++;
    const did: Did = { 
      ...insertDid, 
      id, 
      createdAt: Date.now() 
    };
    this.dids.set(id, did);
    return did;
  }

  async updateDidStatus(id: number, status: string): Promise<Did | undefined> {
    const did = this.dids.get(id);
    if (did) {
      const updatedDid = { ...did, status };
      this.dids.set(id, updatedDid);
      return updatedDid;
    }
    return undefined;
  }

  async getAllNotarizedDocuments(): Promise<NotarizedDocument[]> {
    return Array.from(this.notarizedDocuments.values()).sort((a, b) => b.createdAt - a.createdAt);
  }

  async getNotarizedDocumentById(id: number): Promise<NotarizedDocument | undefined> {
    return this.notarizedDocuments.get(id);
  }

  async getNotarizedDocumentByHash(hash: string): Promise<NotarizedDocument | undefined> {
    return Array.from(this.notarizedDocuments.values()).find(doc => doc.hash === hash);
  }

  async createNotarizedDocument(insertDoc: InsertNotarizedDocument): Promise<NotarizedDocument> {
    const id = this.currentDocId++;
    const doc: NotarizedDocument = { 
      ...insertDoc, 
      id, 
      createdAt: Date.now() 
    };
    this.notarizedDocuments.set(id, doc);
    return doc;
  }

  async searchNotarizedDocuments(query: string): Promise<NotarizedDocument[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.notarizedDocuments.values()).filter(doc => 
      doc.hash.toLowerCase().includes(lowerQuery) ||
      doc.fileName.toLowerCase().includes(lowerQuery) ||
      doc.category.toLowerCase().includes(lowerQuery)
    );
  }
}

export const storage = new MemStorage();
