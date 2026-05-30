"use client";

import { useState, useEffect } from "react";
import { Loader2, Plus, Trash2, ShieldCheck, Database, Users, MessageSquare, Activity, BarChart } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [colleges, setColleges] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "", location: "", fees: "", rating: "", avgPackage: "", highestPackage: "", establishedYear: "", image: ""
  });

  const fetchData = async () => {
    try {
      const [collegesRes, statsRes] = await Promise.all([
        fetch("/api/admin/colleges"),
        fetch("/api/admin/stats")
      ]);
      
      if (!collegesRes.ok || !statsRes.ok) throw new Error("Failed to fetch");
      
      setColleges(await collegesRes.json());
      setStats(await statsRes.json());
    } catch (error) {
      toast.error("Could not load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this college?")) return;
    
    try {
      const res = await fetch("/api/admin/colleges", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("College deleted successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete college");
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/colleges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (!res.ok) throw new Error("Failed to add");
      toast.success("College added successfully!");
      setShowAddForm(false);
      setFormData({ name: "", location: "", fees: "", rating: "", avgPackage: "", highestPackage: "", establishedYear: "", image: "" });
      fetchData();
    } catch (error) {
      toast.error("Failed to add college");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Admin Analytics Portal</h1>
            <p className="text-gray-500">Overview of platform statistics and data management.</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add College
        </button>
      </div>

      {/* Analytics Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-xl"><Database className="w-6 h-6" /></div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Colleges</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalColleges}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl"><Users className="w-6 h-6" /></div>
            <div>
              <p className="text-sm font-medium text-gray-500">Registered Users</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalUsers}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-xl"><MessageSquare className="w-6 h-6" /></div>
            <div>
              <p className="text-sm font-medium text-gray-500">Forum Questions</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalQuestions}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-orange-50 text-orange-600 rounded-xl"><Activity className="w-6 h-6" /></div>
            <div>
              <p className="text-sm font-medium text-gray-500">Forum Answers</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalAnswers}</h3>
            </div>
          </div>
        </div>
      )}

      {showAddForm && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <h2 className="text-xl font-bold mb-6">Add New College</h2>
          <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">College Name</label><input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border rounded-xl" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Location</label><input type="text" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-2 border rounded-xl" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Fees (Annual)</label><input type="number" required value={formData.fees} onChange={e => setFormData({...formData, fees: e.target.value})} className="w-full px-4 py-2 border rounded-xl" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Rating (Out of 5)</label><input type="number" step="0.1" max="5" required value={formData.rating} onChange={e => setFormData({...formData, rating: e.target.value})} className="w-full px-4 py-2 border rounded-xl" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Average Package</label><input type="text" placeholder="e.g. 15 LPA" value={formData.avgPackage} onChange={e => setFormData({...formData, avgPackage: e.target.value})} className="w-full px-4 py-2 border rounded-xl" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Highest Package</label><input type="text" placeholder="e.g. 1.2 CPA" value={formData.highestPackage} onChange={e => setFormData({...formData, highestPackage: e.target.value})} className="w-full px-4 py-2 border rounded-xl" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Established Year</label><input type="number" value={formData.establishedYear} onChange={e => setFormData({...formData, establishedYear: e.target.value})} className="w-full px-4 py-2 border rounded-xl" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Image URL (Optional)</label><input type="url" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full px-4 py-2 border rounded-xl" /></div>
            <div className="md:col-span-2 flex justify-end gap-3 mt-4">
              <button type="button" onClick={() => setShowAddForm(false)} className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors">Cancel</button>
              <button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium flex items-center gap-2">
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />} Save College
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
          <BarChart className="w-5 h-5 text-gray-500" />
          <h3 className="font-bold text-gray-900">Database Records ({colleges.length})</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {colleges.map(college => (
            <div key={college.id} className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors">
              <div>
                <h4 className="font-bold text-gray-900 text-lg">{college.name}</h4>
                <p className="text-gray-500 text-sm">{college.location} • ₹{college.fees.toLocaleString()}/yr</p>
              </div>
              <button
                onClick={() => handleDelete(college.id)}
                className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-2.5 rounded-xl transition-colors"
                title="Delete College"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          {colleges.length === 0 && (
            <div className="p-8 text-center text-gray-500">No colleges found in the database.</div>
          )}
        </div>
      </div>
    </div>
  );
}
