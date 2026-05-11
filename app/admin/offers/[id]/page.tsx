"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Sparkles, Image as ImageIcon, Calendar, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  AdminFormInputEnhanced, 
  AdminSelectEnhanced, 
  AdminFormTextareaEnhanced, 
  AdminCard, 
  AdminLabel, 
  ImageUpload, 
  AdminFormTextarea
} from "@/components/admin";
import { offerService } from "@/lib/api";
import { useAdminToast } from "@/hooks/use-admin-toast";
import { FormValidator, ValidationRules } from "@/utils/form-validation";

export default function OfferFormPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { showSuccess, showError } = useAdminToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  
  const [formData, setFormData] = useState<any>({
    title: "",
    description: "",
    discountText: "",
    startDate: "",
    endDate: "",
    image: "",
    isActive: true,
    type: "banner",
    terms: "",
    link: "/shop"
  });
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);

  const isEditMode = id !== 'add';

  useEffect(() => {
    if (isEditMode && id) {
      loadOffer();
    } else {
      setLoading(false);
    }
  }, [id, isEditMode]);

  const loadOffer = async () => {
    setLoading(true);
    try {
      const response = await offerService.getOffers();
      if (response.success) {
        const offer = response.data.find((o: any) => o._id === id);
        if (offer) {
          setFormData({
            title: offer.title,
            description: offer.description,
            discountText: offer.discountText,
            startDate: offer.startDate ? offer.startDate.split('T')[0] : "",
            endDate: offer.endDate ? offer.endDate.split('T')[0] : "",
            image: offer.image,
            isActive: offer.isActive,
            type: offer.type || "banner",
            terms: offer.terms || "",
            link: offer.link || "/shop"
          });
        }
      }
    } catch (error) {
      console.error('Error loading offer:', error);
      showError("Failed to load offer");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const formState = {
      title: { value: formData.title, rules: ValidationRules.name },
      description: { value: formData.description, rules: ValidationRules.required },
      discountText: { value: formData.discountText, rules: ValidationRules.required },
      endDate: { value: formData.endDate, rules: ValidationRules.required }
    };
    
    const { isValid, errors } = FormValidator.validateForm(formState);
    setFormErrors(errors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      showError("Please fix the validation errors before saving");
      return;
    }

    setSaving(true);
    try {
      const offerData = {
        title: formData.title,
        description: formData.description,
        discountText: formData.discountText,
        startDate: formData.startDate || new Date().toISOString().split('T')[0],
        endDate: formData.endDate,
        isActive: formData.isActive,
        type: formData.type,
        terms: formData.terms,
        link: formData.link
      };

      let result;
      if (isEditMode && id) {
        result = await offerService.updateOffer(id, offerData, selectedFile);
      } else {
        result = await offerService.createOffer(offerData, selectedFile);
      }

      if (result.success) {
        showSuccess(isEditMode ? "Offer updated successfully!" : "Offer created successfully!");
        router.push("/admin/offers");
      } else {
        showError(result.error || "Save failed");
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} offer:`, error);
      showError(`An error occurred while ${isEditMode ? 'updating' : 'creating'} the offer.`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-charcoal/40">Loading...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto pb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="h-9 w-9 rounded-xl bg-white border border-charcoal/10"
          >
            <ArrowLeft size={18} className="text-charcoal/60" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-charcoal">
              {isEditMode ? 'Edit Offer' : 'Add New Offer'}
            </h1>
            <p className="text-xs text-charcoal/40 mt-0.5">
              Fill in the offer details below
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="h-9 px-4 rounded-xl border border-charcoal/10 text-charcoal/60 text-sm"
          >
            Discard
          </Button>
          <Button 
            onClick={handleSave}
            disabled={saving}
            className="h-9 bg-charcoal hover:bg-charcoal/90 text-white text-sm rounded-xl px-5 disabled:opacity-50"
          >
            <Save size={16} className="mr-2" />
            {saving ? "Saving..." : "Save Offer"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AdminCard title="Basic Information" icon={<Sparkles size={18} />}>
            <div className="space-y-4">
              <AdminFormInputEnhanced 
                label="Offer Title"
                value={formData.title}
                onChange={(val) => setFormData({ ...formData, title: val })}
                placeholder="Enter offer title"
                required
                error={formErrors.title}
              />
              <AdminFormTextareaEnhanced 
                label="Description"
                value={formData.description}
                onChange={(val) => setFormData({ ...formData, description: val })}
                placeholder="Describe your offer..."
                rows={4}
                required
                error={formErrors.description}
              />
            </div>
          </AdminCard>

          <AdminCard title="Offer Details" icon={<Tag size={18} />}>
            <div className="space-y-4">
              <AdminFormInputEnhanced 
                label="Discount Text"
                value={formData.discountText}
                onChange={(val) => setFormData({ ...formData, discountText: val })}
                placeholder="e.g. 50% OFF"
                required
                error={formErrors.discountText}
              />
              <AdminSelectEnhanced 
                label="Offer Type"
                value={formData.type}
                onChange={(val) => setFormData({ ...formData, type: val })}
                options={[
                  { value: "banner", label: "Banner" },
                  { value: "popup", label: "Popup" },
                  { value: "sidebar", label: "Sidebar" }
                ]}
                placeholder="Select offer type"
              />
              <AdminFormInputEnhanced 
                label="Redirect Link"
                value={formData.link}
                onChange={(val) => setFormData({ ...formData, link: val })}
                placeholder="e.g. /shop or /products/123"
              />
            </div>
          </AdminCard>

          <AdminCard title="Duration" icon={<Calendar size={18} />}>
            <div className="grid grid-cols-1 gap-4">
              <AdminFormInputEnhanced 
                label="Start Date"
                type="date"
                value={formData.startDate}
                onChange={(val) => setFormData({ ...formData, startDate: val })}
              />
              <AdminFormInputEnhanced 
                label="End Date"
                type="date"
                value={formData.endDate}
                onChange={(val) => setFormData({ ...formData, endDate: val })}
                required
                error={formErrors.endDate}
              />
            </div>
          </AdminCard>

          <AdminCard title="Terms & Conditions" icon={<Info size={18} />}>
            <AdminFormTextarea 
              label="Terms"
              value={formData.terms}
              onChange={(val) => setFormData({ ...formData, terms: val })}
              placeholder="Enter offer terms and conditions..."
              rows={4}
            />
          </AdminCard>
        </div>

        <div className="space-y-4">
          <AdminCard title="Offer Image" icon={<ImageIcon size={18} />}>
            <div className="h-44">
              <ImageUpload 
                label="Banner Image"
                value={formData.image}
                onChange={(val) => setFormData({ ...formData, image: val })}
                onFileSelect={(file) => setSelectedFile(file)}
              />
            </div>
          </AdminCard>

          <AdminCard title="Settings" icon={<Info size={18} />}>
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-charcoal">Active Status</p>
                  <p className="text-[11px] text-charcoal/40">Enable or disable this offer</p>
                </div>
                <Switch 
                  checked={formData.isActive}
                  onCheckedChange={(val) => setFormData({ ...formData, isActive: val })}
                />
              </div>
            </div>
          </AdminCard>

          <div className="bg-charcoal rounded-2xl p-5">
            <div className="flex items-center gap-2 text-gold mb-2">
              <Sparkles size={16} />
              <span className="text-xs font-semibold uppercase tracking-wider">Ready?</span>
            </div>
            <p className="text-xs text-white/60 mb-4">
              Double-check your offer details before saving.
            </p>
            <Button 
              onClick={handleSave}
              disabled={saving}
              className="w-full h-9 bg-gold hover:bg-gold/90 text-charcoal text-sm rounded-xl font-semibold disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Offer"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}