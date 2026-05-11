"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Ticket, RefreshCw, Calendar, Info, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  AdminFormInputEnhanced, 
  AdminSelectEnhanced, 
  AdminFormTextareaEnhanced, 
  AdminCard, 
  AdminLabel, 
  AdminFormTextarea
} from "@/components/admin";
import { couponService } from "@/lib/api";
import { useAdminToast } from "@/hooks/use-admin-toast";
import { FormValidator, ValidationRules } from "@/utils/form-validation";

export default function CouponFormPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { showSuccess, showError } = useAdminToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  
  const [formData, setFormData] = useState<any>({
    code: "",
    discountType: "percentage",
    discountAmount: "",
    minPurchase: "",
    maxDiscount: "",
    startDate: "",
    endDate: "",
    isActive: true,
    usageLimit: "100",
    description: "",
    userType: "All"
  });

  const isEditMode = id !== 'add';

  useEffect(() => {
    if (isEditMode && id) {
      loadCoupon();
    } else {
      setLoading(false);
    }
  }, [id, isEditMode]);

  const loadCoupon = async () => {
    setLoading(true);
    try {
      const response = await couponService.getCoupons();
      if (response.success) {
        const coupon = response.data.find((c: any) => c._id === id);
        if (coupon) {
          setFormData({
            code: coupon.code,
            discountType: coupon.discountType,
            discountAmount: coupon.discountAmount.toString(),
            minPurchase: coupon.minPurchase?.toString() || "",
            maxDiscount: coupon.maxDiscount?.toString() || "",
            startDate: coupon.startDate ? coupon.startDate.split('T')[0] : "",
            endDate: coupon.endDate ? coupon.endDate.split('T')[0] : "",
            isActive: coupon.isActive,
            usageLimit: coupon.usageLimit?.toString() || "100",
            description: coupon.description || "",
            userType: coupon.userType || "All"
          });
        }
      }
    } catch (error) {
      console.error('Error loading coupon:', error);
      showError("Failed to load coupon");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const formState = {
      code: { value: formData.code, rules: ValidationRules.required },
      discountAmount: { value: formData.discountAmount, rules: ValidationRules.price },
      endDate: { value: formData.endDate, rules: ValidationRules.required }
    };
    
    const { isValid, errors } = FormValidator.validateForm(formState);
    setFormErrors(errors);
    return isValid;
  };

  const generateCouponCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, code });
  };

  const handleSave = async () => {
    if (!validateForm()) {
      showError("Please fix the validation errors before saving");
      return;
    }

    setSaving(true);
    try {
      const couponData = {
        code: formData.code.toUpperCase(),
        discountType: formData.discountType,
        discountAmount: Number(formData.discountAmount),
        minPurchase: formData.minPurchase ? Number(formData.minPurchase) : 0,
        maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : undefined,
        startDate: formData.startDate || new Date().toISOString().split('T')[0],
        endDate: formData.endDate,
        isActive: formData.isActive,
        usageLimit: Number(formData.usageLimit),
        description: formData.description,
        userType: formData.userType
      };

      let result;
      if (isEditMode && id) {
        result = await couponService.updateCoupon(id, couponData);
      } else {
        result = await couponService.createCoupon(couponData);
      }

      if (result.success) {
        showSuccess(isEditMode ? "Coupon updated successfully!" : "Coupon created successfully!");
        router.push("/admin/coupons");
      } else {
        showError(result.error || "Save failed");
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} coupon:`, error);
      showError(`An error occurred while ${isEditMode ? 'updating' : 'creating'} the coupon.`);
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
              {isEditMode ? 'Edit Coupon' : 'Add New Coupon'}
            </h1>
            <p className="text-xs text-charcoal/40 mt-0.5">
              Fill in the coupon details below
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
            {saving ? "Saving..." : "Save Coupon"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AdminCard title="Coupon Code" icon={<Ticket size={18} />}>
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <AdminFormInputEnhanced 
                    label="Unique Code"
                    value={formData.code}
                    onChange={(val) => setFormData({ ...formData, code: val.toUpperCase() })}
                    placeholder="e.g. WELCOME10"
                    required
                    error={formErrors.code}
                  />
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={generateCouponCode}
                    type="button"
                    variant="outline"
                    className="h-11 rounded-xl border border-charcoal/10 text-charcoal/60 hover:text-charcoal"
                  >
                    <RefreshCw size={16} className="mr-2" />
                    Generate
                  </Button>
                </div>
              </div>
            </div>
          </AdminCard>

          <AdminCard title="Discount Settings" icon={<Sparkles size={18} />}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <AdminSelectEnhanced 
                  label="Discount Type"
                  value={formData.discountType}
                  onChange={(val) => setFormData({ ...formData, discountType: val })}
                  options={[
                    { value: "percentage", label: "Percentage (%)" },
                    { value: "fixed", label: "Fixed Amount (₹)" }
                  ]}
                />
                <AdminFormInputEnhanced 
                  label="Discount Value"
                  type="number"
                  value={formData.discountAmount}
                  onChange={(val) => setFormData({ ...formData, discountAmount: val })}
                  placeholder={formData.discountType === "percentage" ? "10" : "500"}
                  required
                  error={formErrors.discountAmount}
                />
              </div>
              <AdminFormInputEnhanced 
                label="Maximum Discount Cap (₹)"
                type="number"
                value={formData.maxDiscount}
                onChange={(val) => setFormData({ ...formData, maxDiscount: val })}
                placeholder="e.g. 1000"
              />
            </div>
          </AdminCard>

          <AdminCard title="Usage Restrictions" icon={<Ticket size={18} />}>
            <div className="space-y-4">
              <AdminFormInputEnhanced 
                label="Minimum Purchase Amount (₹)"
                type="number"
                value={formData.minPurchase}
                onChange={(val) => setFormData({ ...formData, minPurchase: val })}
                placeholder="e.g. 1000"
              />
              <AdminFormInputEnhanced 
                label="Usage Limit per User"
                type="number"
                value={formData.usageLimit}
                onChange={(val) => setFormData({ ...formData, usageLimit: val })}
                placeholder="e.g. 1"
              />
            </div>
          </AdminCard>

          <AdminCard title="Validity Period" icon={<Calendar size={18} />}>
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

          <AdminCard title="Additional Information" icon={<Info size={18} />}>
            <AdminFormTextarea 
              label="Description"
              value={formData.description}
              onChange={(val) => setFormData({ ...formData, description: val })}
              placeholder="What is this coupon for? (e.g. First time customer offer)"
              rows={4}
            />
          </AdminCard>
        </div>

        <div className="space-y-4">
          <AdminCard title="Target Audience" icon={<Info size={18} />}>
            <AdminSelectEnhanced 
              label="User Type"
              value={formData.userType}
              onChange={(val) => setFormData({ ...formData, userType: val })}
              options={[
                { value: "All", label: "All Customers" },
                { value: "New", label: "First-time Users Only" },
                { value: "VIP", label: "VIP / Repeat Customers" },
                { value: "Special", label: "Special Segment" }
              ]}
            />
          </AdminCard>

          <AdminCard title="Status" icon={<Info size={18} />}>
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-charcoal">Active Status</p>
                  <p className="text-[11px] text-charcoal/40">Enable or disable this coupon</p>
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
              Double-check the code and discount value before saving.
            </p>
            <Button 
              onClick={handleSave}
              disabled={saving}
              className="w-full h-9 bg-gold hover:bg-gold/90 text-charcoal text-sm rounded-xl font-semibold disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Coupon"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}