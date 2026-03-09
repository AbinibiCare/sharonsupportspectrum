"use client";

import { useEffect, useState } from "react";

type Lead = {
  id: number;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  enquiry_type: string;
  message: string;
  status: string;
};

export default function AdminLeadsPage() {
  const [adminKey, setAdminKey] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadLeads() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/leads", {
        headers: {
          "x-admin-key": adminKey,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load leads");
      }

      setLeads(data.leads || []);
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">
          Sharon Support Spectrum CRM
        </h1>

        {/* Admin Key Input */}
        <div className="mb-6">
          <input
            type="password"
            placeholder="Enter admin key"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            className="px-4 py-2 text-black rounded mr-3"
          />

          <button
            onClick={loadLeads}
            className="bg-yellow-400 text-black px-4 py-2 rounded"
          >
            Load Leads
          </button>
        </div>

        {loading && <p>Loading leads...</p>}
        {error && <p className="text-red-400">{error}</p>}

        {/* Leads Table */}
        <table className="w-full border border-gray-700">
          <thead className="bg-gray-900">
            <tr>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Phone</th>
              <th className="p-3 border">Type</th>
              <th className="p-3 border">Message</th>
            </tr>
          </thead>

          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-t border-gray-700">
                <td className="p-3">
                  {new Date(lead.created_at).toLocaleString()}
                </td>
                <td className="p-3">{lead.name}</td>
                <td className="p-3">{lead.email}</td>
                <td className="p-3">{lead.phone}</td>
                <td className="p-3">{lead.enquiry_type}</td>
                <td className="p-3">{lead.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}