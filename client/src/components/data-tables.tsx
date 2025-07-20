import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function DataTables() {
  const [dids, setDids] = useState([]);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    fetch("/api/dids").then(res => res.json()).then(setDids);
    fetch("/api/documents").then(res => res.json()).then(setDocuments);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      {/* Registered DIDs Table */}
      <Card className="rounded-3xl border border-purple-100 bg-gradient-to-br from-purple-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="text-purple-800">📌 Registered DIDs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>DID</TableHead>
                <TableHead>Wallet</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dids.map((did: any) => (
                <TableRow key={did.id}>
                  <TableCell className="font-mono">{did.did}</TableCell>
                  <TableCell className="font-mono text-xs">{did.walletAddress}</TableCell>
                  <TableCell>{did.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Notarized Documents Table */}
      <Card className="rounded-3xl border border-green-100 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="text-green-800">📄 Notarized Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hash</TableHead>
                <TableHead>File</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc: any) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-mono text-xs">{doc.hash.slice(0, 18)}...</TableCell>
                  <TableCell>{doc.fileName}</TableCell>
                  <TableCell>{doc.category}</TableCell>
                  <TableCell>{new Date(doc.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
