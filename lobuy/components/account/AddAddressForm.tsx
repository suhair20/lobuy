"use client";

import { useState } from "react";
import { apiFetch, type ApiError } from "@/lib/api";

export default function AddAddressForm({ onSaved }: { onSaved?: () => void }) {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    district: "",
    city: "",
    pincode: "",
    addressLine: "",
    landmark: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.fullName.trim()) next.fullName = "Full name is required.";
    if (!/^[6-9]\d{9}$/.test(form.phone)) next.phone = "Enter a valid 10-digit phone number.";
    if (!form.district) next.district = "District is required.";
    if (!form.city.trim()) next.city = "City / Local area is required.";
    if (!/^\d{6}$/.test(form.pincode)) next.pincode = "Pincode must be 6 digits.";
    else if (Number(form.pincode) < 670000 || Number(form.pincode) > 699999) next.pincode = "Enter a valid Kerala pincode.";
    if (!form.addressLine.trim()) next.addressLine = "Address line is required.";
    return next;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    try {
      await apiFetch("/api/user/address", {
        method: "POST",
        body: JSON.stringify(form),
      });
      onSaved?.();
    } catch (err) {
      const apiError = err as ApiError;
      alert(apiError.data?.message || "Failed to save address");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4 p-1">
        <Field name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} error={errors.fullName} />
        <div>
          <select name="district" className="w-full rounded-md border border-gray-300 p-2" onChange={handleChange}>
            <option value="">Select District</option>
            {["Thiruvananthapuram","Kollam","Pathanamthitta","Alappuzha","Kottayam","Idukki","Ernakulam","Thrissur","Palakkad","Malappuram","Kozhikode","Wayanad","Kannur","Kasaragod"].map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
          {errors.district && <p className="text-sm text-red-500">{errors.district}</p>}
        </div>
        <Field name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} error={errors.phone} />
        <Field name="addressLine" placeholder="Address Line" value={form.addressLine} onChange={handleChange} error={errors.addressLine} />
        <Field name="landmark" placeholder="Landmark (optional)" value={form.landmark} onChange={handleChange} />
        <Field name="city" placeholder="City" value={form.city} onChange={handleChange} error={errors.city} />
        <Field name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} error={errors.pincode} />
      </div>
      <button type="submit" className="h-10 w-24 rounded-md bg-blue-950 font-semibold text-white">Save</button>
    </form>
  );
}

function Field({
  name,
  placeholder,
  value,
  onChange,
  error,
}: {
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}) {
  return (
    <div>
      <input name={name} placeholder={placeholder} value={value} onChange={onChange} className="w-full rounded-md border border-gray-300 p-2" />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
