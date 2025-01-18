const Product = require('../../models/Product');
const ProductImages = require('../../models/ProductImages');
const ProductAvailability = require('../../models/ProductAvailability');
const ProductTag = require('../../models/ProductTag'); // Import ProductTags model

// Seller adds a product
exports.AddProduct = async (req, res) => {
    const {
        userId,
        productName,
        description,
        price,
        brand,
        stock,
        keyboardLanguage,
        discount,
        memory,
        dimensions,
        storage,
        weight,
        warranty,
        warrantyType,
        taxExcludedPrice,
        taxIncludedPrice,
        taxRule,
        unitPrice,
        minimumOrder,
        acceptOrder,
        availableNow,
        availableLater,
        madeOffer,
        allowCustomization,
        images,
        width,
        height,
        depth,
        category,
        tags,
        notes
    } = req.body;

    console.log(req.body)

    try {
        // Step 1: Create the product
        const newProduct = new Product({
            productName,
            description,
            price:parseFloat(unitPrice),
            brand,
            keyboardLanguage,
            memory,
            discount,
            dimensions,
            category,
            storage,
            stock,
            weight,
            warranty,
            width,
            height,
            depth,
            notes,
            warrantyType,
            taxExcludedPrice: parseFloat(taxExcludedPrice),
            taxIncludedPrice: parseFloat(taxIncludedPrice),
            taxRule,
            unitPrice,
            minimumOrder,
            userId
        });
        await newProduct.save();

        // Step 2: Save product images
        if (images && images.length > 0) {
            const imagePromises = images.map(imageUrl => {
                return new ProductImages({
                    productId: newProduct._id,
                    Image: imageUrl // Use the URL provided by Cloudinary
                }).save();
            });
            await Promise.all(imagePromises);
        }

        // Step 3: Save product availability details
        const productAvailability = new ProductAvailability({
            productId: newProduct._id, // Reference to the newly created product
            accept_Order: acceptOrder,
            available_now: availableNow,
            available_later: availableLater,
            made_offer: madeOffer,
            allow_customization: allowCustomization
        });
        await productAvailability.save();

        // Step 4: Save product tags (if provided)
        if (tags && tags.length > 0) {
            const tagPromises = tags.map(tag => {
                return new ProductTag({
                    productId: newProduct._id,
                    tag
                }).save();
            });
            await Promise.all(tagPromises);
        }

        res.status(201).json({
            message: 'Product added successfully!',
            product: newProduct,
            availability: productAvailability,
            images,
            tags // Return tags for confirmation
        });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
