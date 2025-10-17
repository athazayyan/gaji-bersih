# 🎯 Toast Notification System

Sistem notifikasi toast modern untuk GajiBersih dengan shimmer animations.

## 🚀 Quick Start

### 1. Import useToast Hook

```tsx
import { useToast } from "@/app/components/ToastProvider";
```

### 2. Use in Component

```tsx
function MyComponent() {
  const toast = useToast();

  const handleAction = () => {
    toast.success("Aksi berhasil!");
  };

  return <button onClick={handleAction}>Klik Saya</button>;
}
```

## 📋 Toast Types

### ✅ Success Toast

```tsx
toast.success("Data berhasil disimpan!");
```

- **Color**: Green gradient
- **Icon**: Checkmark circle
- **Usage**: Operasi berhasil, save success, upload complete

### ❌ Error Toast

```tsx
toast.error("Terjadi kesalahan. Coba lagi.");
```

- **Color**: Red gradient
- **Icon**: X circle
- **Usage**: Validation errors, API failures, network errors

### ⚠️ Warning Toast

```tsx
toast.warning("Anda harus menyetujui syarat & ketentuan");
```

- **Color**: Yellow-Orange gradient
- **Icon**: Warning triangle
- **Usage**: Missing requirements, unsaved changes, confirmations

### ℹ️ Info Toast

```tsx
toast.info("Sistem akan maintenance dalam 5 menit");
```

- **Color**: Green gradient (bg-gradient-hijau)
- **Icon**: Info circle
- **Usage**: General information, tips, announcements

## ⏱️ Custom Duration

Default duration adalah 3000ms (3 detik). Anda bisa customize:

```tsx
// Show for 5 seconds
toast.success("Pesan ini tampil 5 detik", 5000);

// Show for 1.5 seconds
toast.error("Cepat hilang", 1500);
```

## 🎨 Toast Features

- ✅ Shimmer slide-in animation dari kanan
- ✅ Auto-dismiss setelah duration
- ✅ Manual close button
- ✅ Multiple toasts support (stacked)
- ✅ Responsive design
- ✅ Gradient backgrounds
- ✅ Icon indicators
- ✅ Fixed positioning (tidak ganggu konten)

## 📍 Current Implementation

### ✅ Auth Page (`/auth`)

- Login validation errors
- Register validation errors
- Success messages
- Network errors

### 🔜 Rekomendasi Implementasi

**High Priority:**

- [ ] `/settings/profile` - Profile update success/error
- [ ] `/settings/security` - Password change
- [ ] `/home` - Document upload success
- [ ] Upload berkas - File upload progress
- [ ] Form submissions - Save/update confirmations

**Medium Priority:**

- [ ] Delete confirmations
- [ ] Copy to clipboard
- [ ] Session expired warnings
- [ ] Network status changes

## 🎯 Best Practices

1. **Use appropriate type** - Match toast type dengan context
2. **Keep messages short** - Max 1-2 sentences
3. **Be specific** - "Email sudah terdaftar" vs "Error"
4. **User-friendly language** - Avoid technical jargon
5. **Actionable when possible** - Tell users what to do next

## 💡 Examples

### Form Validation

```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!email) {
    toast.error("Email wajib diisi");
    return;
  }

  if (!password || password.length < 6) {
    toast.error("Kata sandi minimal 6 karakter");
    return;
  }

  try {
    await submitForm();
    toast.success("Data berhasil disimpan!");
  } catch (error) {
    toast.error("Gagal menyimpan data. Coba lagi.");
  }
};
```

### API Calls

```tsx
const deleteDocument = async (id: string) => {
  try {
    await api.delete(`/documents/${id}`);
    toast.success("Dokumen berhasil dihapus");
    refreshList();
  } catch (error) {
    toast.error("Gagal menghapus dokumen");
  }
};
```

### Upload Progress

```tsx
const uploadFile = async (file: File) => {
  toast.info("Mengupload file...");

  try {
    await api.upload(file);
    toast.success("File berhasil diupload!");
  } catch (error) {
    toast.error("Upload gagal. Periksa koneksi Anda.");
  }
};
```

### Copy to Clipboard

```tsx
const copyText = (text: string) => {
  navigator.clipboard.writeText(text);
  toast.success("Teks berhasil disalin!");
};
```

## 🔧 Advanced Usage

### Conditional Messages

```tsx
const saveProfile = async (data: ProfileData) => {
  try {
    const result = await api.updateProfile(data);

    if (result.emailChanged) {
      toast.warning("Email berubah. Silakan verifikasi email baru Anda.");
    } else {
      toast.success("Profil berhasil diperbarui!");
    }
  } catch (error) {
    toast.error("Gagal memperbarui profil");
  }
};
```

### Chain Toasts

```tsx
const processData = async () => {
  toast.info("Memproses data...");

  setTimeout(() => {
    toast.success("Data berhasil diproses!");
  }, 2000);
};
```

## 🎨 Styling

Toast menggunakan:

- **Font**: Poppins (consistency dengan brand)
- **Shadows**: shadow-2xl untuk depth
- **Rounded**: rounded-xl untuk modern look
- **Animations**: slide-in-right (0.3s ease-out)
- **Z-index**: 9999 (always on top)
- **Position**: fixed top-4 right-4

## 📱 Mobile Responsive

Toast otomatis responsive:

- Desktop: Fixed top-right
- Mobile: Full width dengan padding
- Touch-friendly close button
- Readable font sizes

## ✅ Integration Checklist

Untuk setiap form/action baru:

- [ ] Import useToast hook
- [ ] Add success toast untuk happy path
- [ ] Add error toast untuk error cases
- [ ] Add warning toast untuk validations
- [ ] Add info toast untuk proses panjang
- [ ] Test semua scenarios
- [ ] Verify message clarity

---

**Created**: October 18, 2025  
**Version**: 1.0.0  
**Status**: Production Ready ✅
