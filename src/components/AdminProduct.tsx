//@ts-nocheck

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input"; // Assuming you have this component
import { useFirebase } from "@/Services/context";
import React,{ useEffect, useState } from "react";
import { storage } from "@/Services/Firebase.config";
import { deleteObject, getDownloadURL, ref as storageRef, uploadBytes } from "firebase/storage";
import { push, ref as dbRef, set, ref, get, remove, onValue, update  } from "firebase/database";
import { database } from "@/Services/Firebase.config";
import toast from "react-hot-toast";
import { MdDeleteForever } from "react-icons/md";

const ProductCard = React.memo(({ product,handleAddProduct }) => {
 
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-md transition p-4 flex flex-col" onClick={()=>{handleAddProduct(product)}}>
      <img src={product?.productImageURL} alt={product.productName} className="rounded-md h-[250px] w-full object-cover mb-3" />
      <div className="text-center mb-2">
        <p className="text-sm text-gray-500">{product.productName}</p>
      </div>
      <div className="text-center mb-2">
        <span className="text-emerald-600 font-bold mr-2">₹{product.salesPrice?.toFixed(2)}</span>
        <span className="text-red-500 line-through">₹{product.beforeDiscPrice?.toFixed(2)}</span>
      </div>
      {/* <div className="mt-auto flex justify-between items-center">
        {product.youtubeURL && <button><FaYoutube className="text-red-500 text-3xl cursor-pointer" /></button>}
        {qty > 0 ? (
          <div className="flex items-center mx-auto gap-2">
            <button onClick={() => updateCartQty(product.productId, "dec")} className="px-2 py-1 bg-red-500 text-white rounded">−</button>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => updateCartQty(product.productId, parseInt(e.target.value))}
              className="w-16 text-center border rounded px-2 py-1"
            />
            <button onClick={() => updateCartQty(product.productId, "inc")} className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-red-500 text-white rounded">+</button>
          </div>
        ) : (
          <Button className="bg-gradient-to-r from-yellow-400 to-red-500 text-white px-6 py-2 rounded-full mx-auto" onClick={() => toggleCart(product)}>
            Add To Cart
          </Button>
        )}
        <button onClick={() => {
          toggleWishList(product.id);
          toast.success(isInWishlist ? 'Product is removed from wishlist' : 'Product is added to wishlist')
        }}>
          {isInWishlist ? <FaHeart className="text-2xl text-red-500" /> : <CiHeart className="text-3xl" />}
        </button>
      </div> */}
    </div>
  );
});

const AdminProduct = ({ handleAddProduct }) => {
  const { products} = useFirebase();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [Categories, setCategories] = useState();


  // const filteredProducts = products.filter((item) =>
  //   item.productName?.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const filteredProducts = products.filter((item) => {
    const matchesSearch = item.productName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "" || item.CategoryName === selectedCategory;
    return matchesSearch && matchesCategory;
  });


   useEffect(() => {
  const CategoriesRef = ref(database, "FC/GeneralMaster/Product Group");

  const unsubscribe = onValue(CategoriesRef, (snapshot) => {
    const data = snapshot.val();
    const formatted = data ? Object.values(data) : [];
    setCategories(formatted);
  });

  return () => unsubscribe();
}, []);

 
  return (
    <Dialog>
      <DialogTrigger>
        <Button className="text-sm cursor-pointer">+ Add Product</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto p-4">
        <DialogHeader>
          <DialogTitle className="text-xl mb-4">Choose Product</DialogTitle>

          {/* Search Bar */}
          <Input
            placeholder="Search by product namesds..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
           <select
  value={selectedCategory}
  onChange={(e) => setSelectedCategory(e.target.value)}
  className="border rounded-md px-4 py-2 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
>
  <option value="">All Categories</option>
  {Categories?.map((category) => (
    <option key={category.id} value={category.generalName}>
      {category.generalName}
    </option>
  ))}
</select>

        </DialogHeader>

        {/* Scrollable filtered product list */}
        <div className="space-y-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((item, index) => (
              <div key={index} className="shadow-md rounded-md overflow-hidden">
                <ProductCard product={item} handleAddProduct={handleAddProduct} />
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No products found.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminProduct;

const handleDeleteProduct = async (product) => {
  if (!product?.id) return alert("Product ID not found");

  const productRef = dbRef(database, `FC/Products/${product.id}`);
  try {
    await remove(productRef);
    alert("Product deleted successfully.");
  } catch (error) {
    console.error("Error deleting product:", error);
    alert("Failed to delete product.");
  }
};

export const AddProductToShop = () => {
  const [formData, setFormData] = useState({
    CategoryName: "",
    FlavourCode: 0,
    PriceListID: "",
    PriceListName: "",
    SubCategoryCode: 0,
    active: true,
    beforeDiscPrice: 0,
    cessPerc: 0,
    cgstperc: 0,
    companyID: "",
    contains: "",
    discAmt: 0,
    discPerc: 0,
    free: 0,
    gst: 0,
    hsnCode: "",
    id: "",
    importStatus: false,
    isMarginBased: false,
    margin: 0,
    per: 1,
    productCode: 0,
    productGroupCode: 0,
    productGroupId: "",
    productId: "",
    productImageURL: "",
    productImageURL2: "",
    productName: "",
    qty: 0,
    rate: 0,
    retailproduct: true,
    salesPrice: 0,
    sgstperc: 0,
    sortingorder: 1,
    stock: 0,
    stockValue: 0,
    uom: 0,
    uomid: "",
    youtubeURL: "",
    tag:""
  });

  const [imageFile, setImageFile] = useState(null);
  const [imageFile2, setImageFile2] = useState(null);

  const [loading, setLoading] = useState(false);
  const [generalMaster,setGeneralMaster]=useState();
  useEffect(()=>{
           
         const getCatagory=async()=>{
                const orderRef = ref(database, `FC/GeneralMaster`);
                    const snapshot = await get(orderRef);
                    setGeneralMaster(snapshot.val())
                    // return snapshot.exists() ?  : null;
         }
         getCatagory();
  },[])

  const handleChange = (field: string, value: string | number | boolean) => {

    const numberFields = [
      'discPerc', 'discAmt', 'salesPrice', 'rate',
      'qty', 'free', 'margin', 'per', 'beforeDiscPrice',
      'stock', 'stockValue', 'cgstperc', 'sgstperc', 'cessPerc', 'gst',
      'productCode', 'productGroupCode', 'uom'
    ];
    const booleanFields = ['active', 'importStatus', 'isMarginBased'];

    let parsedValue: string | number | boolean = value;

    if (numberFields.includes(field)) {
      parsedValue = Number(value);
    } else if (booleanFields.includes(field)) {
      parsedValue = value === 'true' || value === true;
    }

    setFormData((prev) => {
      const updated = {
        ...prev,
        [field]: parsedValue,
      };

      // Auto-calculate Discount Amount and Sales Price
      const beforeDisc = Number(updated.beforeDiscPrice);
      const discPerc = Number(updated.discPerc);

      if (!isNaN(beforeDisc) && !isNaN(discPerc)) {
        const discAmt = (beforeDisc * discPerc) / 100;
        const salesPrice = beforeDisc - discAmt;
        updated.discAmt = parseFloat(discAmt.toFixed(2)); // optional rounding
        updated.salesPrice = parseFloat(salesPrice.toFixed(2));
      }
      return updated;
    });
  };

  const handleImageUpload = async () => {
    if (!imageFile) return "";
    const imgRef = storageRef(storage, `images/FC/products/${Date.now()}`);
    const snapshot = await uploadBytes(imgRef, imageFile);
    return await getDownloadURL(snapshot.ref);
  };

  const handleImageUpload2 = async () => {
    if (!imageFile2) return "";
    const imgRef = storageRef(storage, `images/FC/products/${Date.now()}`);
    const snapshot = await uploadBytes(imgRef, imageFile2);
    return await getDownloadURL(snapshot.ref);
  };

  
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const imageUrl = await handleImageUpload();
      let imageUrl2 = "";
      if(imageFile2)
      {
         imageUrl2 = await handleImageUpload2();
      }
      if(!formData.productName)
      {
        toast.error("Product Name is required");
        return;
      }
      if(!formData.CategoryName)
      {
        toast.error("Category Name required");
        return;
      }
      if(!formData.beforeDiscPrice)
      {
        toast.error("Before Discount Price is required");
        return;
      }
      if(!formData.uom)
      {
        toast.error("Unit is required");
        return;
      }
      const ProductdbId = Date.now().toString();
      const finalData = {
        ...formData,
        productImageURL: imageUrl,
        productImageURL2: imageUrl2,
        id: ProductdbId,
      };

      const productRef = dbRef(database, `FC/Products/${ProductdbId}`);
      await set(productRef, finalData);

      toast.success("Product added successfully!");

      // Reset
      setFormData({
        CategoryName: "",
        FlavourCode: 0,
        PriceListID: "",
        PriceListName: "",
        SubCategoryCode: 0,
        active: true,
        beforeDiscPrice: 0,
        cessPerc: 0,
        cgstperc: 0,
        companyID: "",
        contains: "",
        discAmt: 0,
        discPerc: 0,
        free: 0,
        gst: 0,
        hsnCode: "",
        id: "",
        importStatus: false,
        isMarginBased: false,
        margin: 0,
        per: 1,
        productCode: 0,
        productGroupCode: 0,
        productGroupId: "",
        productId: "",
        productImageURL: "",
        productImageURL2: "",
        productName: "",
        qty: 0,
        rate: 0,
        retailproduct: true,
        salesPrice: 0,
        sgstperc: 0,
        sortingorder: 1,
        stock: 0,
        stockValue: 0,
        uom: 0,
        uomid: "",
        youtubeURL: "",
        tag:""
      });

      setImageFile(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="text-sm mb-2 cursor-pointer">+ Add Product To Shop</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto p-4 w-full">
        <DialogHeader>
          <DialogTitle className="text-xl mb-4">Create Product</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <div>
            <label>Product Id</label>
            <Input
              type="text"
              placeholder="Product Id"
              value={formData.productId}
              onChange={(e) => handleChange("productId", e.target.value)}
            />
          </div>
          <div>
            <label>Product Name</label>
            <Input
              type="text"
              placeholder="Product Name"
              value={formData.productName}
              onChange={(e) => handleChange("productName", e.target.value)}
            />
          </div>

          {/* <div>
            <label>Category Name</label>
            <Input
              type="text"
              placeholder="Category Name"
              value={formData.CategoryName}
              onChange={(e) => handleChange("CategoryName", e.target.value)}
            />
          </div> */}
          <div>
  <label>Category Name</label>
  <select
    className="w-full border px-2 py-1 rounded"
    value={formData.CategoryName}
    onChange={(e) => {
      const selectedName = e.target.value;
      const selectedGroup = Object.values(generalMaster?.["Product Group"] || {}).find(
        (group) => group.generalName === selectedName
      );

      if (selectedGroup) {
        handleChange("CategoryName", selectedGroup.generalName);
        handleChange("productGroupCode", selectedGroup.id); // or generalCode if you prefer
      }
    }}
  >
    <option value="">Select Category</option>
    {generalMaster?.["Product Group"] &&
      Object.values(generalMaster["Product Group"]).map((group) => (
        <option key={group.id} value={group.generalName}>
          {group.generalName}
        </option>
      ))}
  </select>
</div>



          <div>
            <label>Before Discount Price</label>
            <Input
              type="number"
              placeholder="Before Discount Price"
              value={formData.beforeDiscPrice}
              onChange={(e) =>
                handleChange("beforeDiscPrice", e.target.value === "" ? "" : +e.target.value)
              }
            />
          </div>

          <div>
            <label>Discount %</label>
            <Input
              type="number"
              placeholder="Discount %"
              value={formData.discPerc}
              onChange={(e) => handleChange("discPerc", e.target.value)}
            />
          </div>

          {/* <div>
            <label>Discount Amount</label>
            <Input
              type="number"
              placeholder="Discount Amount"
              value={formData.discAmt}
              readOnly
            />
          </div> */}

          <div>
            <label>Sales Price</label>
            <Input
              type="number"
              placeholder="Sales Price"
              value={formData.salesPrice}
              readOnly
            />
          </div>

          <div>
            <label>GST</label>
            <Input
              type="number"
              placeholder="GST"
              value={formData.gst}
              onChange={(e) => handleChange("gst", e.target.value)}
            />
          </div>

          {/* <div>
            <label>SGST</label>
            <Input
              type="number"
              placeholder="SGST"
              value={formData.sgstperc}
              onChange={(e) => handleChange("sgstperc", e.target.value)}
            />
          </div>

          <div>
            <label>CGST</label>
            <Input
              type="number"
              placeholder="CGST"
              value={formData.cgstperc}
              onChange={(e) => handleChange("cgstperc", e.target.value)}
            />
          </div> */}
  <div>
            <label>Per Unit</label>
            <Input
              type="number"
              placeholder="Per"
              value={formData.per}
              onChange={(e) => handleChange("per", e.target.value)}
            />
          </div>

          {/* <div>
            <label>Unit</label>
            <Input
              type="text"
              placeholder="Unit"
              value={formData.uom}
              onChange={(e) => handleChange("uom", e.target.value)}
            />
          </div> */}
          <div>
  <label>Unit</label>
<select
  className="w-full border px-2 py-1 rounded"
  value={formData.uom}
  onChange={(e) => {
    const selectedId = e.target.value;
    const selectedGroup = generalMaster?.["UOM"]?.[selectedId];
    if (selectedGroup) {
      handleChange("uom", selectedGroup.id); // or use selectedGroup.generalCode if preferred
    }
  }}
>
  <option value="">Select Unit</option>
  {generalMaster?.["UOM"] &&
    Object.values(generalMaster["UOM"]).map((group) => (
      <option key={group.id} value={group.id}>
        {group.generalName}
      </option>
    ))}
</select>

</div>

          <div>
            <label>Contains</label>
            <Input
              type="text"
              placeholder="Contains"
              value={formData.contains}
              onChange={(e) => handleChange("contains", e.target.value)}
            />
          </div>

          <div>
            <label>Purchase Rate</label>
            <Input
              type="number"
              placeholder="Rate"
              value={formData.rate}
              onChange={(e) => handleChange("rate", e.target.value)}
            />
          </div>

        

          {/* <div>
            <label>Margin</label>
            <Input
              type="number"
              placeholder="Margin"
              value={formData.margin}
              onChange={(e) => handleChange("margin", e.target.value === "" ? "" : +e.target.value)}
            />
          </div> */}

          <div>
            <label>Sorting Order</label>
            <Input
              type="number"
              placeholder="Sorting Order"
              value={formData.sortingorder}
              onChange={(e) =>
                handleChange("sortingorder", e.target.value === "" ? "" : +e.target.value)
              }
            />
          </div>

          <div>
            <label>YouTube URL</label>
            <Input
              type="text"
              placeholder="YouTube URL"
              value={formData.youtubeURL}
              onChange={(e) => handleChange("youtubeURL", e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Tag Name</label>
            <select
              className="w-full border px-2 py-1 rounded"
              value={formData.tag || ""}
              onChange={(e) => {
                const selectedTag = e.target.value;
                handleChange("tag", selectedTag); // Just saving tagName as string
              }}
            >
              <option value="">Select Tag</option>
              {Array.isArray(generalMaster?.Tags) &&
                generalMaster.Tags.map((tag, index) => (
                  <option key={index} value={tag}>
                    {tag}
                  </option>
                ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label>Upload Image File For Product1</label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
            {imageFile && (
              <div className="mt-2">
                <p className="font-semibold">New Image Preview:</p>
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="New Preview"
                  className="w-32 h-32 object-cover border rounded"
                />
              </div>
            )}
          </div>
          <div className="sm:col-span-2">
            <label>Upload Image File2 For Product</label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile2(e.target.files[0])}
            />
            {imageFile2 && (
              <div className="mt-2">
                <p className="font-semibold">New Image2 Preview:</p>
                <img
                  src={URL.createObjectURL(imageFile2)}
                  alt="New Preview"
                  className="w-32 h-32 object-cover border rounded"
                />
              </div>
            )}
          </div>
          
                    {/* Active Checkbox */}
          <div>
              <label className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => handleChange("active", e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
            </div>
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Uploading..." : "Add Product"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const EditProductCard = React.memo(({ product, setselectedProduct, handleDeleteProduct }) => {
  const onDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent triggering setselectedProduct

    const confirmed = window.confirm(`Are you sure you want to delete "${product.productName}"?`);
    if (confirmed) {
      handleDeleteProduct(product);
    }
  };

  return (
    <div
      className="relative bg-white rounded-xl shadow hover:shadow-md transition p-4 flex flex-col"
      onClick={() => setselectedProduct(product)}
    >
      {/* Delete Icon */}
      <MdDeleteForever
        className="absolute top-2 right-2 text-red-600 text-2xl hover:text-red-800 cursor-pointer z-10"
        onClick={onDeleteClick}
      />
      <img
        src={product?.productImageURL}
        alt={product.productName}
        className="rounded-md h-[250px] w-full object-contain mb-3 bg-white"
      />
      <div className="text-center mb-2">
        <p className="text-sm text-gray-500">{product.productName}</p>
      </div>
      <div className="text-center mb-2">
        <span className="text-emerald-600 font-bold mr-2">
          ₹{product.salesPrice?.toFixed(2)}
        </span>
        <span className="text-red-500 line-through">
          ₹{product.beforeDiscPrice?.toFixed(2)}
        </span>
      </div>
    </div>
  );
});


 
export const EditProduct=()=>{
  const { products, Categories } = useFirebase();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setselectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");


  const [loading, setLoading] = useState(false);
  const [generalMaster,setGeneralMaster]=useState();
  useEffect(()=>{
      const getCatagory=async()=>{
            const orderRef = ref(database, `FC/GeneralMaster`);
                const snapshot = await get(orderRef);
                setGeneralMaster(snapshot.val())
                // return snapshot.exists() ?  : null;
      }
      getCatagory();
  },[selectedProduct])
  

  // const filteredProducts = products.filter((item) =>
  //   item.productName?.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const filteredProducts = products.filter((item) => {
    const matchesSearch = item.productName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "" || item.CategoryName === selectedCategory;
    // console.log("Selected Category:", selectedCategory);
    // console.log("matchesSearch:", matchesSearch, "matchesCategory:", matchesCategory);
    return matchesSearch && matchesCategory;
  });

  const [imageFile, setImageFile] = useState(null);
  const [imageFile2, setImageFile2] = useState(null);


   const handleChange = (field: string, value: string | number | boolean) => {

    const numberFields = [
      'discPerc', 'discAmt', 'salesPrice', 'rate',
      'qty', 'free', 'margin', 'per', 'beforeDiscPrice',
      'stock', 'stockValue', 'cgstperc', 'sgstperc', 'cessPerc', 'gst',
      'productCode', 'productGroupCode', 'uom'
    ];
    const booleanFields = ['active', 'importStatus', 'isMarginBased'];

    let parsedValue: string | number | boolean = value;

    if (numberFields.includes(field)) {
      parsedValue = Number(value);
    } else if (booleanFields.includes(field)) {
      parsedValue = value === 'true' || value === true;
    }

    setselectedProduct((prev) => {
      const updated = {
        ...selectedProduct,
        [field]: parsedValue,
      };

      // Auto-calculate Discount Amount and Sales Price
      const beforeDisc = Number(updated.beforeDiscPrice);
      const discPerc = Number(updated.discPerc);
      
      if (!isNaN(beforeDisc) && !isNaN(discPerc)) {
        const discAmt = (beforeDisc * discPerc) / 100;
        const salesPrice = beforeDisc - discAmt;
        updated.discAmt = parseFloat(discAmt.toFixed(2)); // optional rounding
        updated.salesPrice = parseFloat(salesPrice.toFixed(2));
      }

      return updated;
    });
  };


  const handleImageUpload = async () => {
    if (!imageFile) return "";
    const imgRef = storageRef(storage, `images/FC/products/${Date.now()}-${imageFile.name}`);
    const snapshot = await uploadBytes(imgRef, imageFile);
    return await getDownloadURL(snapshot.ref);
  };
   const handleImageUpload2 = async () => {
    if (!imageFile2) return "";
    const imgRef = storageRef(storage, `images/FC/products/${Date.now()}-${imageFile2.name}`);
    const snapshot = await uploadBytes(imgRef, imageFile2);
    return await getDownloadURL(snapshot.ref);
  };
   const handleSubmit = async () => {
    try {
      setLoading(true);
      const imageUrl = await handleImageUpload();
      const imageUrl2 = await handleImageUpload2();


      const finalData = {
        ...selectedProduct,
        productImageURL: imageUrl ? imageUrl : selectedProduct.productImageURL,
        productImageURL2: imageUrl2 ? imageUrl2 : selectedProduct.productImageURL2,
      };
     const productRef = dbRef(database, `FC/Products/${selectedProduct.id}`);
     await set(productRef, finalData);

      toast.success("Product updated successfully!");
      setImageFile(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to Edit product");
    } finally {
      setLoading(false);
    }
  };
  if(!Categories) return;
  return (
    <Dialog>
      <DialogTrigger>
        <Button className="text-sm mb-2 cursor-pointer">Edit / Delete Product</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto p-4">
        <DialogHeader>
          <DialogTitle className="text-xl mb-4">Choose Product To Edit</DialogTitle>
          <p>Total Items:{filteredProducts.length}</p>
           
          {/* Search Bar */}
          {!selectedProduct&&<Input
            placeholder="Search by product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
          }
          {!selectedProduct&&
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full max-w-xs p-2 border border-gray-300 rounded mb-4"
          >
            <option value="">All Categories</option>
            {
               Object.values(Categories)?.map((category) => (
                <option key={category.id} value={category.generalName}>
                  {category.generalName}
                </option>
              ))}
          </select>
//           <select
//   value={selectedCategory}
//   onChange={(e) => setSelectedCategory(e.target.value)}
//   className="border rounded-md px-4 py-2 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
// >
//   <option value="">All Categories</option>
//   {Categories?.map((category) => (
//     <option key={category.id} value={category.generalName}>
//       {category.generalName}
//     </option>
//   ))}
// </select>

          }
        </DialogHeader>

        {/* Scrollable filtered product list */}
       {!selectedProduct&&<div className="space-y-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((item, index) => (
              <div key={index} className="shadow-md rounded-md overflow-hidden cursor-pointer">
                <EditProductCard product={item} setselectedProduct={setselectedProduct} handleDeleteProduct={handleDeleteProduct}/>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No products found.</p>
          )}
        </div>}
         <Button onClick={()=>setselectedProduct(null)} className="mb-4">
            ← Back 
          </Button>
        {selectedProduct?.productImageURL && (
          <div className="col-span-2">
           
            <p className="font-semibold">Current Image:</p>
            <img
              src={selectedProduct.productImageURL}
              alt="Current Product"
              className="w-32 h-32 object-cover border rounded"
            />
          </div>
          )}
          {selectedProduct?.productImageURL2 && (
          <div className="col-span-2">
           
            <p className="font-semibold">Current Image:</p>
            <img
              src={selectedProduct.productImageURL2}
              alt="Current Product"
              className="w-32 h-32 object-cover border rounded"
            />
          </div>
          )}

       {selectedProduct && (
  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          
          <div>
            <label>Product Id</label>
            <Input
              type="text"
              placeholder="Product Id"
              value={selectedProduct.productId}
              onChange={(e) => handleChange("productId", e.target.value)}
            />
          </div>
          <div>
            <label>Product Name</label>
            <Input
              type="text"
              placeholder="Product Name"
              value={selectedProduct.productName}
              onChange={(e) => handleChange("productName", e.target.value)}
            />
          </div>

          {/* <div>
            <label>Category Name</label>
            <Input
              type="text"
              placeholder="Category Name"
              value={selectedProduct.CategoryName}
              onChange={(e) => handleChange("CategoryName", e.target.value)}
            />
          </div> */}
         <div>
            <label>Category Name</label>
            <select
              className="w-full border px-2 py-1 rounded"
              value={selectedProduct.CategoryName}
              onChange={(e) => {
                const selectedName = e.target.value;
                const selectedGroup = Object.values(generalMaster?.["Product Group"] || {}).find(
                  (group) => group.generalName === selectedName
                );

                if (selectedGroup) {
                  handleChange("CategoryName", selectedGroup.generalName);
                  handleChange("productGroupCode", selectedGroup.id); // or generalCode if you prefer
                }
              }}
            >
              <option value="">Select Category</option>
              {generalMaster?.["Product Group"] &&
                Object.values(generalMaster["Product Group"]).map((group) => (
                  <option key={group.id} value={group.generalName}>
                    {group.generalName}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label>Before Discount Price</label>
            <Input
              type="number"
              placeholder="Before Discount Price"
              value={selectedProduct.beforeDiscPrice}
              onChange={(e) =>
                handleChange("beforeDiscPrice", e.target.value === "" ? "" : +e.target.value)
              }
            />
          </div>

          <div>
            <label>Discount %</label>
            <Input
              type="number"
              placeholder="Discount %"
              value={selectedProduct.discPerc}
              onChange={(e) => handleChange("discPerc", e.target.value)}
            />
          </div>

          {/* <div>
            <label>Discount Amount</label>
            <Input
              type="number"
              placeholder="Discount Amount"
              value={formData.discAmt}
              readOnly
            />
          </div> */}

          <div>
            <label>Sales Price</label>
            <Input
              type="number"
              placeholder="Sales Price"
              value={selectedProduct.salesPrice}
              readOnly
            />
          </div>

          <div>
            <label>GST</label>
            <Input
              type="number"
              placeholder="GST"
              value={selectedProduct.gst}
              onChange={(e) => handleChange("gst", e.target.value)}
            />
          </div>

          {/* <div>
            <label>SGST</label>
            <Input
              type="number"
              placeholder="SGST"
              value={formData.sgstperc}
              onChange={(e) => handleChange("sgstperc", e.target.value)}
            />
          </div>

          <div>
            <label>CGST</label>
            <Input
              type="number"
              placeholder="CGST"
              value={formData.cgstperc}
              onChange={(e) => handleChange("cgstperc", e.target.value)}
            />
          </div> */}
  <div>
            <label>Per Unit</label>
            <Input
              type="number"
              placeholder="Per"
              value={selectedProduct.per}
              onChange={(e) => handleChange("per", e.target.value)}
            />
          </div>

          {/* <div>
            <label>Unit</label>
            <Input
              type="text"
              placeholder="Unit"
              value={selectedProduct.uom}
              onChange={(e) => handleChange("uom", e.target.value)}
            />
          </div> */}
                    <div>
  <label>Unit</label>
<select
  className="w-full border px-2 py-1 rounded"
  value={selectedProduct.uom}
  onChange={(e) => {
    const selectedId = e.target.value;
    const selectedGroup = generalMaster?.["UOM"]?.[selectedId];
    if (selectedGroup) {
      handleChange("uom", selectedGroup.id); // or use selectedGroup.generalCode if preferred
    }
  }}
>
  <option value="">Select Unit</option>
  {generalMaster?.["UOM"] &&
    Object.values(generalMaster["UOM"]).map((group) => (
      <option key={group.id} value={group.id}>
        {group.generalName}
      </option>
    ))}
</select>

</div>
          <div>
            <label>Contains</label>
            <Input
              type="text"
              placeholder="Contains"
              value={selectedProduct.contains}
              onChange={(e) => handleChange("contains", e.target.value)}
            />
          </div>

          <div>
            <label>Purchase Rate</label>
            <Input
              type="number"
              placeholder="Rate"
              value={selectedProduct.rate}
              onChange={(e) => handleChange("rate", e.target.value)}
            />
          </div>

        

          {/* <div>
            <label>Margin</label>
            <Input
              type="number"
              placeholder="Margin"
              value={formData.margin}
              onChange={(e) => handleChange("margin", e.target.value === "" ? "" : +e.target.value)}
            />
          </div> */}

          <div>
            <label>Sorting Order</label>
            <Input
              type="number"
              placeholder="Sorting Order"
              value={selectedProduct.sortingorder}
              onChange={(e) =>
                handleChange("sortingorder", e.target.value === "" ? "" : +e.target.value)
              }
            />
          </div>

          <div>
            <label>YouTube URL</label>
            <Input
              type="text"
              placeholder="YouTube URL"
              value={selectedProduct.youtubeURL}
              onChange={(e) => handleChange("youtubeURL", e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Tag Name</label>
            <select
              className="w-full border px-2 py-1 rounded"
              value={selectedProduct.tag || ""}
              onChange={(e) => {
                const selectedTag = e.target.value;
                handleChange("tag", selectedTag); // Just saving tagName as string
              }}
            >
              <option value="">Select Tag</option>
              {Array.isArray(generalMaster?.Tags) &&
                generalMaster.Tags.map((tag, index) => (
                  <option key={index} value={tag}>
                    {tag}
                  </option>
                ))}
            </select>
          </div>
          
          <div className="sm:col-span-2 space-y-4">
            {/* Label and File Input */}
            <div>
              <label className="block font-medium mb-1">Upload Image File For Product</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
            </div>

            {/* Image Preview */}
            {imageFile && (
              <div>
                <p className="font-semibold mb-1">New Image Preview:</p>
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="New Preview"
                  className="w-32 h-32 object-cover border rounded"
                />
              </div>
            )}

            <div>
              <label className="block font-medium mb-1">Upload Image File 2 For Product</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile2(e.target.files[0])}
              />
            </div>

            {/* Image Preview */}
            {imageFile2 && (
              <div>
                <p className="font-semibold mb-1">New Image Preview:</p>
                <img
                  src={URL.createObjectURL(imageFile2)}
                  alt="New Preview"
                  className="w-32 h-32 object-cover border rounded"
                />
              </div>
            )}

            {/* Active Checkbox */}
            <div>
              <label className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedProduct.active}
                  onChange={(e) => handleChange("active", e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
            </div>


            {/* Submit Button */}
            <div className="flex justify-center mt-2">
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "Uploading..." : "Update Product"}
              </Button>
            </div>
          </div>
        </div>
)}

      </DialogContent>
    </Dialog>
  );

}


export const EditSettings = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    const getSetting = async () => {
      const settingRef = dbRef(database, `FC/Settings`);
      const snapshot = await get(settingRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        setSettings(data[0]);
        setFormData(data[0]);
      }
    };
    getSetting();
  }, []);

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (file: File, path: string) => {
    setLoading(true);
    const fileRef = storageRef(storage, path);
    await uploadBytes(fileRef, file);
    setLoading(false);
    return await getDownloadURL(fileRef);

  };

  const handleBannerUpload = async (files: FileList, type: "desktop" | "mobile") => {
    setLoading(true);

    const newUrls: string[] = [];
    for (const file of Array.from(files)) {
      const url = await handleFileUpload(file, `FC/banners/${type}/${Date.now()}-${file.name}`);
      newUrls.push(url);
    }
    handleChange(
      type === "desktop" ? "bannerDesktop" : "bannerMobile",
      [...(formData[type === "desktop" ? "bannerDesktop" : "bannerMobile"] || []), ...newUrls]
    );
    setLoading(false);
  };

  const handleRemoveBanner = async (url: string, type: "desktop" | "mobile") => {
    try {
      // delete from firebase storage
    setLoading(true);

      const path = decodeURIComponent(url.split("/o/")[1].split("?")[0]);
      await deleteObject(storageRef(storage, path));

      // update local state
      const updatedBanners = (formData[type === "desktop" ? "bannerDesktop" : "bannerMobile"] || []).filter(
        (img: string) => img !== url
      );
      handleChange(type === "desktop" ? "bannerDesktop" : "bannerMobile", updatedBanners);
    } catch (err) {
      console.error("Error removing banner:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await update(dbRef(database, `FC/Settings`), {
        '0': { ...formData }
      });
      setSettings(formData);
      alert("✅ Settings updated successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update settings");
    }
    setLoading(false);
  };

  if (!settings) return <p>Loading...</p>;

return (
 
    <div className="max-h-[90vh] overflow-y-auto p-4 space-y-6 bg-gray-50 rounded-lg shadow-inner">

  {/* BASIC INFO */}
  <div className="bg-white p-4 rounded-lg shadow-sm border">
    <h2 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-1">Basic Info</h2>
    <div className="grid gap-4">
      {[
        ["CompanyName", "Company Name"],
        ["Address", "Address"],
        ["CellNO", "Cell No"],
        ["OfficeNo", "Office No"],
        ["EmailID", "Email ID"],
        ["GSTIN", "GSTIN"],
        ["WhatsappNo", "Whatsapp No"],
      ].map(([field, label]) => (
        <div key={field} className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-600">{label}</label>
          <input
            className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={label}
            value={formData[field] || ""}
            onChange={(e) => handleChange(field, e.target.value)}
          />
        </div>
      ))}
    </div>
  </div>

  {/* MIN ORDER & ALERTS */}
  <div className="bg-white p-4 rounded-lg shadow-sm border">
    <h2 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-1">Orders & Alerts</h2>
    <div className="grid gap-4">
      {/* Min Order */}
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium text-gray-600">Minimum Order Value</label>
        <input
          type="number"
          className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.MinOrderValue || ""}
          onChange={(e) => handleChange("MinOrderValue", Number(e.target.value))}
        />
      </div>

      {/* Alerts */}
      {[
        ["AlertMessage", "Alert Message"],
        ["AlertMessage1", "Alert Message 1"],
      ].map(([field, label]) => (
        <div key={field} className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-600">{label}</label>
          <textarea
            className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData[field] || ""}
            onChange={(e) => handleChange(field, e.target.value)}
          />
        </div>
      ))}
    </div>
  </div>

  {/* SOCIAL LINKS */}
  <div className="bg-white p-4 rounded-lg shadow-sm border">
    <h2 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-1">Social Links</h2>
    <div className="grid gap-4">
      {[
        ["YouTube", "YouTube URL"],
        ["Instagram", "Instagram URL"],
        ["Twitter", "Twitter URL"],
        ["PlayStore", "Play Store URL"],
        ["Facebook", "Facebook URL"],
      ].map(([field, label]) => (
        <div key={field} className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-600">{label}</label>
          <input
            className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData[field] || ""}
            onChange={(e) => handleChange(field, e.target.value)}
          />
        </div>
      ))}
    </div>
  </div>

  {/* LOCATION */}
  <div className="bg-white p-4 rounded-lg shadow-sm border">
    <h2 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-1">Location</h2>
    <div className="grid gap-4">
      {[
        ["latitude", "Latitude"],
        ["longitude", "Longitude"],
      ].map(([field, label]) => (
        <div key={field} className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-600">{label}</label>
          <input
            type="number"
            className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData[field] || ""}
            onChange={(e) => handleChange(field, Number(e.target.value))}
          />
        </div>
      ))}
    </div>
  </div>

  {/* ORDER CONTACTS */}
  <div className="bg-white p-4 rounded-lg shadow-sm border">
    <h2 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-1">Order Contacts</h2>
    <div className="grid gap-4">
      {[
        ["orderContactNo1", "Order Contact No 1"],
        ["orderContactNo2", "Order Contact No 2"],
      ].map(([field, label]) => (
        <div key={field} className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-600">{label}</label>
          <input
            className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData[field] || ""}
            onChange={(e) => handleChange(field, e.target.value)}
          />
        </div>
      ))}
    </div>
  </div>

  {/* PDF UPLOAD */}
  <div className="bg-white p-4 rounded-lg shadow-sm border">
    <h2 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-1">PDF Upload</h2>
    <input
      type="file"
      accept="application/pdf"
      onChange={async (e) => {
        const file = e.target.files?.[0];
        if (file) {
          const url = await handleFileUpload(file, `FC/pdf/${file.name}`);
          handleChange("pdfURL", url);
        }
      }}
    />
    {formData.pdfURL && (
      <p className="text-sm text-blue-600 mt-1">
        Current PDF:{" "}
        <a href={formData.pdfURL} target="_blank" rel="noopener noreferrer">
          View
        </a>
      </p>
    )}
  </div>

  {/* DESKTOP BANNERS */}
  <div className="bg-white p-4 rounded-lg shadow-sm border">
    <h2 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-1">Desktop Banners</h2>
    <input
      type="file"
      multiple
      accept="image/*"
      onChange={(e) => {
        if (e.target.files) handleBannerUpload(e.target.files, "desktop");
      }}
    />
    <div className="flex flex-wrap gap-2 mt-2">
      {(formData.bannerDesktop || []).map((url: string, idx: number) => (
        <div key={idx} className="relative">
          <img src={url} alt="desktop banner" className="w-32 h-20 object-cover rounded" />
          <button
            type="button"
            onClick={() => handleRemoveBanner(url, "desktop")}
            className="absolute top-0 right-0 bg-red-500 text-white px-1 rounded"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  </div>

  {/* MOBILE BANNERS */}
  <div className="bg-white p-4 rounded-lg shadow-sm border">
    <h2 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-1">Mobile Banners</h2>
    <input
      type="file"
      multiple
      accept="image/*"
      onChange={(e) => {
        if (e.target.files) handleBannerUpload(e.target.files, "mobile");
      }}
    />
    <div className="flex flex-wrap gap-2 mt-2">
      {(formData.bannerMobile || []).map((url: string, idx: number) => (
        <div key={idx} className="relative">
          <img src={url} alt="mobile banner" className="w-20 h-32 object-cover rounded" />
          <button
            type="button"
            onClick={() => handleRemoveBanner(url, "mobile")}
            className="absolute top-0 right-0 bg-red-500 text-white px-1 rounded"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  </div>

  {/* SAVE BUTTON */}
  <Button
    onClick={handleSave}
    disabled={loading}
    className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
  >
    {loading ? "Saving..." : "Save Settings"}
  </Button>
</div>

);

};

// src/pages/PrintPriceList.tsx
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const PrintPriceList = () => {
  const { products, Categories, setting } = useFirebase();
  const [gmaster, setgmaster] = useState<any>(null);

  useEffect(() => {
    const cartRef = ref(database, `FC/GeneralMaster`);
    const unsubscribe = onValue(cartRef, (snapshot) => {
      setgmaster(snapshot.exists() ? snapshot.val() : {});
    });

    return () => unsubscribe();
  }, []);

  if (!Categories || !products || !setting || !gmaster) {
    return null;
  }

  console.log(gmaster);

  const groupedData = Object.values(Categories)
    .map((cat: any) => ({
      ...cat,
      products: products.filter((p: any) => p.productGroupId === cat.id),
    }))
    .filter((cat) => cat.products.length > 0);

  // Helper to get UOM name by ID
  const getUOMName = (id: string | number) => {
    return gmaster?.UOM?.[id]?.generalName || "";
  };

  const handlePrintPDF = async () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPos = 10;

    // ===== Load Logo =====
    const loadImage = async (url: string) => {
      const res = await fetch(url);
      const blob = await res.blob();
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    };

    const logo = await loadImage("/logo.png");

    // ===== Logo =====
    doc.addImage(logo, "PNG", pageWidth / 2 - 15, yPos, 30, 30);
    yPos += 35;

    // ===== Company Name =====
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(`${setting[0].CompanyName}`, pageWidth / 2, yPos, { align: "center" });
    yPos += 8;

    // ===== Address =====
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`${setting[0].Address}`, pageWidth / 2, yPos, {
      align: "center",
      maxWidth: pageWidth - 20,
    });
    yPos += 8;

    // ===== Phone Numbers =====
    doc.setFontSize(10);
    const phoneText = `Phone: ${setting[0].CellNO || ""}${
      setting[0].orderContactNo1 ? " / " + setting[0].orderContactNo2 : ""
    }`;
    doc.text(phoneText, pageWidth / 2, yPos, { align: "center" });
    yPos += 12;

    let count = 1;

    groupedData.forEach((cat: any) => {
      // ===== Calculate table height for page break check =====
      const tempDoc = new jsPDF();
      autoTable(tempDoc, {
        head: [["No", "Product Name", "Per", "List Price", "Discount %", "Sales Price", "Qty", "Amount"]],
        body: cat.products.map((p: any, idx: number) => [
          idx + 1,
          p.productName || "",
          `${p.per || ""} ${getUOMName(p.uom)}`,
          Number(p.beforeDiscPrice?.toFixed(2)) || "",
          p.discPerc || "",
          Number(p.salesPrice?.toFixed(2)) || "",
          "",
          "",
        ]),
        theme: "grid",
        styles: { fontSize: 10 },
      });

      const tableHeight = (tempDoc as any).lastAutoTable.finalY - 10;
      const neededHeight = tableHeight + 10 + 6;

      if (pageHeight - yPos < neededHeight) {
        doc.addPage();
        yPos = 10;
      }

      // ===== Category Heading =====
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(cat.generalName, pageWidth / 2, yPos, { align: "center" });
      yPos += 6;

      // ===== Real Table =====
      autoTable(doc, {
        startY: yPos,
        head: [["No", "Product Name", "Per", "List Price", "Discount %", "Sales Price", "Qty", "Amount"]],
        body: cat.products.map((p: any) => [
          count++,
          p.productName || "",
          `${p.per || ""} ${getUOMName(p.uom)}`,
          Number(p.beforeDiscPrice?.toFixed(2)) || "",
          p.discPerc || "",
          Number(p.salesPrice?.toFixed(2)) || "",
          "",
          "",
        ]),
        theme: "grid",
        headStyles: {
          fillColor: [128, 0, 128],
          textColor: 255,
          halign: "center",
        },
        styles: {
          halign: "center",
          fontSize: 10,
        },
        columnStyles: {
          1: { halign: "left" },
        },
      });

      yPos = (doc as any).lastAutoTable.finalY + 10;
    });

    doc.save("price_list.pdf");
  };

  return (
    <Button onClick={handlePrintPDF} className="mb-2">
      Print Product List
    </Button>
  );
};

