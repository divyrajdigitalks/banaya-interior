"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Filter, Edit3, Trash2, Plus, ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from "@/components/ui/dialog";
import { AdminTable } from "@/components/admin/admin-table";
import { AdminFormInputEnhanced } from "@/components/admin/form-input-enhanced";
import { AdminSelectEnhanced } from "@/components/admin/admin-select-enhanced";
import { AdminCard } from "@/components/admin/admin-card";
import { filterService, type FilterOption } from "@/lib/api";
import { useAdminToast } from "@/hooks/use-admin-toast";
import { FormValidator, ValidationRules } from "@/utils/form-validation";

const filterGroups = [
  { value: "Type", label: "Type" },
  { value: "Colour", label: "Colour" },
  { value: "Materials", label: "Materials" },
  { value: "Shape", label: "Shape" },
  { value: "UsePurpose", label: "Use / Purpose" },
  { value: "Occasions", label: "Occasions" },
];

export default function AdminFilterOptionsPage() {
  const router = useRouter();
  const { showSuccess, showError } = useAdminToast();
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFilterOption, setEditingFilterOption] = useState<FilterOption | null>(null);
  const [formData, setFormData] = useState<Partial<FilterOption>>({ name: "", filterGroup: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("All");
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    loadFilterOptions();
  }, []);

  const loadFilterOptions = async () => {
    setLoading(true);
    try {
      const data = await filterService.getFilterOptionList(true);
      setFilterOptions(data);
    } catch (error) {
      showError("Failed to load filter options");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      header: "Option",
      accessorKey: "name",
      cell: (item: FilterOption) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
            <Filter size={16} className="text-gold" />
          </div>
          <div>
            <span className="text-sm font-medium text-charcoal">{item.name}</span>
            <p className="text-[11px] text-charcoal/40 uppercase">{item.filterGroup}</p>
          </div>
        </div>
      )
    },
    {
      header: "Created Date",
      accessorKey: "createdAt",
      cell: (item: FilterOption) => (
        <span className="text-[12px] text-charcoal/60">
          {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          }) : "—"}
        </span>
      )
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (item: FilterOption) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); handleOpenDialog(item); }}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white transition-all"
          >
            <Edit3 size={14} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setDeleteId(item.id); }}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-50 text-red-500 border border-red-100 hover:bg-red-500 hover:text-white transition-all"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )
    }
  ];

  const validateForm = () => {
    const formState = {
      name: { value: formData.name, rules: ValidationRules.name },
      filterGroup: { value: formData.filterGroup, rules: ValidationRules.required }
    };
    
    const { isValid, errors } = FormValidator.validateForm(formState);
    setFormErrors(errors);
    return isValid;
  };

  const handleOpenDialog = (filterOption: FilterOption | null = null) => {
    if (filterOption) {
      setEditingFilterOption(filterOption);
      setFormData({ 
        name: filterOption.name, 
        filterGroup: filterOption.filterGroup,
      });
    } else {
      setEditingFilterOption(null);
      setFormData({ name: "", filterGroup: "Type" });
    }
    setFormErrors({});
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!validateForm()) {
      showError("Please fix the validation errors");
      return;
    }
    
    setSaving(true);
    try {
      if (editingFilterOption) {
        await filterService.updateFilterOption(editingFilterOption.id, formData);
        showSuccess("Filter option updated successfully!");
      } else {
        await filterService.createFilterOption(formData as FilterOption);
        showSuccess("Filter option created successfully!");
      }
      
      await loadFilterOptions();
      setIsDialogOpen(false);
    } catch (error) {
      showError(editingFilterOption ? "Failed to update filter option" : "Failed to create filter option");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await filterService.deleteFilterOption?.(id);
      showSuccess("Filter option deleted successfully!");
      await loadFilterOptions();
    } catch (error) {
      showError("Failed to delete filter option");
    } finally {
      setDeleteId(null);
    }
  };

  const filteredFilterOptions = filterOptions.filter(opt => {
    const matchesSearch = opt.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGroup = selectedGroup === "All" || opt.filterGroup === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-charcoal/40">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="h-9 w-9 rounded-xl bg-white border border-charcoal/10"
          >
            <ArrowLeft size={18} className="text-charcoal/60" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-charcoal">Filter Options</h1>
            <p className="text-xs text-charcoal/40 mt-0.5">Manage product filter options</p>
          </div>
        </div>
      </div>

      <AdminCard>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/30" size={16} />
              <input 
                placeholder="Search options..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-3 bg-white border border-charcoal/10 rounded-xl text-sm focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all outline-none"
              />
            </div>
            <div className="w-full sm:w-48">
              <select 
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full h-10 px-3 bg-white border border-charcoal/10 rounded-xl text-sm focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all outline-none"
              >
                <option value="All">All Groups</option>
                {filterGroups.map(group => (
                  <option key={group.value} value={group.value}>{group.label}</option>
                ))}
              </select>
            </div>
          </div>

          <Button 
            onClick={() => handleOpenDialog()}
            className="h-10 bg-charcoal hover:bg-charcoal/90 text-white text-sm rounded-xl px-4"
          >
            <Plus size={16} className="mr-2" />
            Add Option
          </Button>
        </div>
      </AdminCard>

      <AdminCard>
        <AdminTable columns={columns} data={filteredFilterOptions} />
      </AdminCard>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] w-[95vw] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-charcoal">
              {editingFilterOption ? "Edit Filter Option" : "Add Filter Option"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <AdminSelectEnhanced 
              label="Filter Group"
              value={formData.filterGroup || ""}
              onChange={(val) => setFormData({ ...formData, filterGroup: val })}
              options={filterGroups}
              placeholder="Select filter group"
              required
              error={formErrors.filterGroup}
            />
            <AdminFormInputEnhanced 
              label="Option Name"
              value={formData.name || ""}
              onChange={(val) => setFormData({ ...formData, name: val })}
              placeholder="e.g. Trays, Round, Teak Wood"
              required
              error={formErrors.name}
            />
          </div>
          <DialogFooter className="flex gap-3">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="flex-1 h-9 rounded-xl border border-charcoal/10">Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="flex-1 h-9 bg-charcoal hover:bg-charcoal/90 text-white rounded-xl">
              <Save size={16} className="mr-2" />
              {saving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Filter Option</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this filter option? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-3">
            <AlertDialogCancel className="flex-1 h-9 rounded-xl border border-charcoal/10">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteId && handleDelete(deleteId)}
              className="flex-1 h-9 bg-red-500 hover:bg-red-600 text-white rounded-xl"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
