import { useState } from "react";
import { Alert, Typography, TextField, Button, Box, Stack } from "@mui/material";
import { Fragment } from "react";
import "./CreateProductForm.css";
import { useDispatch } from "react-redux";
import { createProduct } from "../../../Redux/Customers/Product/Action";

const initialSizes = [
  { name: "S", quantity: 0 },
  { name: "M", quantity: 0 },
  { name: "L", quantity: 0 },
];

const CreateProductForm = () => {
  const [productData, setProductData] = useState({
    imageUrl: "",
    brand: "",
    title: "",
    color: "",
    discountedPrice: "",
    price: "",
    discountPersent: "",
    sizes: initialSizes,
    quantity: "",
    topLevelCategory: "",
    secondLevelCategory: "",
    thirdLevelCategory: "",
    description: "",
  });

  const [alertVisible, setAlertVisible] = useState(false);

  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSizeChange = (e, index) => {
    let { name, value } = e.target;
    name === "size_quantity" ? (name = "quantity") : (name = e.target.name);

    const sizes = [...productData.sizes];
    sizes[index][name] = value;
    setProductData((prevState) => ({
      ...prevState,
      sizes: sizes,
    }));
  };

  const handleAddSize = () => {
    const sizes = [...productData.sizes];
    sizes.push({ name: "", quantity: "" });
    setProductData((prevState) => ({
      ...prevState,
      sizes: sizes,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createProduct({ data: productData, jwt }));
      setAlertVisible(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => {
        setAlertVisible(false);
      }, 5000);
    } catch (error) {
      console.error("Failed to create product:", error);
      // Optionally show error alert
      setAlertVisible(true);
      setAlertType("error"); // You'll need to add this state
      setAlertMessage("Failed to create product"); // You'll need to add this state
    }
  };

  return (
    <Fragment>
      <Typography
        variant="h3"
        sx={{ textAlign: "center" }}
        className="py-10 text-center "
      >
        Add New Product
      </Typography>
      {alertVisible && (
        <Alert
          severity="success"
          onClose={() => setAlertVisible(false)}
          sx={{
            background: "linear-gradient(to bottom, #ffffff, #f0f0f0)",
            color: "darkgreen",
            marginBottom: "20px",
          }}
        >
          Product created successfully!
        </Alert>
      )}
      <form
        onSubmit={handleSubmit}
        className="createProductContainer min-h-screen"
      >
        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Image URL"
            name="imageUrl"
            value={productData.imageUrl}
            onChange={handleChange}
          />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              fullWidth
              label="Brand"
              name="brand"
              value={productData.brand}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={productData.title}
              onChange={handleChange}
            />
          </Stack>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              fullWidth
              label="Color"
              name="color"
              value={productData.color}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Quantity"
              name="quantity"
              value={productData.quantity}
              onChange={handleChange}
              type="number"
            />
          </Stack>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              fullWidth
              label="Price"
              name="price"
              value={productData.price}
              onChange={handleChange}
              type="number"
            />
            <TextField
              fullWidth
              label="Discounted Price"
              name="discountedPrice"
              value={productData.discountedPrice}
              onChange={handleChange}
              type="number"
            />
            <TextField
              fullWidth
              label="Discount Percentage"
              name="discountPersent"
              value={productData.discountPersent}
              onChange={handleChange}
              type="number"
            />
          </Stack>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              fullWidth
              label="Top Level Category"
              name="topLevelCategory"
              value={productData.topLevelCategory}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Second Level Category"
              name="secondLevelCategory"
              value={productData.secondLevelCategory}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Third Level Category"
              name="thirdLevelCategory"
              value={productData.thirdLevelCategory}
              onChange={handleChange}
            />
          </Stack>
          <TextField
            fullWidth
            id="outlined-multiline-static"
            label="Description"
            multiline
            name="description"
            rows={3}
            onChange={handleChange}
            value={productData.description}
          />
          {productData.sizes && productData.sizes.map((size, index) => (
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} key={index}>
              <TextField
                label="Size Name"
                name="name"
                value={size.name}
                onChange={(event) => handleSizeChange(event, index)}
                required
                fullWidth
              />
              <TextField
                label="Quantity"
                name="size_quantity"
                type="number"
                onChange={(event) => handleSizeChange(event, index)}
                required
                fullWidth
              />
            </Stack>
          ))}
          <Button
            variant="contained"
            sx={{ p: 1.8 }}
            className="py-20"
            size="large"
            type="submit"
          >
            Add New Product
          </Button>
        </Stack>
      </form>
    </Fragment>
  );
};

export default CreateProductForm;