const Product = require('../../models/Product');
const ProductImages = require('../../models/ProductImages');
const ProductAvailability = require('../../models/ProductAvailability');
const ProductTag = require('../../models/ProductTag'); // Import ProductTag model
const fs = require('fs');
const csv = require('csv-parser'); // Ensure you have this package installed

// Seller bulk uploads products from CSV file
exports.BulkUpload = (req, res) => {
    const { userId } = req.body; // Retrieve userId from the body
    const filePath = req.file.path; // Get the uploaded file path

    if (!req.file) {
        return res.status(400).json({ message: 'Please upload a CSV file.' });
    }

    const results = [];

    // Read and parse the CSV file
    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
            results.push({
                userId: userId,
                productName: data.product_name,
                description: data.description,
                price: parseFloat(data.price),
                brand: data.brand,
                keyboardLanguage: data.keyboard_language,
                memory: data.memory,
                storage: data.storage,
                weight: data.weight,
                warranty: data.warranty,
                warrantyType: data.warranty_type,
                taxExcludedPrice: parseFloat(data.tax_excluded_price),
                taxIncludedPrice: parseFloat(data.tax_included_price),
                taxRule: data.tax_rule,
                unitPrice: parseFloat(data.unit_price),
                minimumOrder: parseInt(data.minimum_order),
                acceptOrder: data.acceptorder && data.acceptorder.toLowerCase() === 'yes',
                availableNow: data.availablenow && data.availablenow.toLowerCase() === 'yes',
                availableLater: data.availablelater && data.availablelater.toLowerCase() === 'yes',
                madeOffer: data.madeoffer && data.madeoffer.toLowerCase() === 'yes',
                allowCustomization: data.allowcustomization && data.allowcustomization.toLowerCase() === 'yes',
                images: data.images.split(',').map(image => image.trim()),
                tags: data.tags.split(',').map(tag => tag.trim())
            });
        })
        .on('end', async () => {
            try {
                const productPromises = results.map(async (productData) => {
                    // Step 1: Create the product
                    const newProduct = new Product({
                        productName: productData.productName,
                        description: productData.description,
                        price: productData.price,
                        brand: productData.brand,
                        keyboardLanguage: productData.keyboardLanguage,
                        memory: productData.memory,
                        storage: productData.storage,
                        weight: productData.weight,
                        warranty: productData.warranty,
                        warrantyType: productData.warrantyType,
                        taxExcludedPrice: productData.taxExcludedPrice,
                        taxIncludedPrice: productData.taxIncludedPrice,
                        taxRule: productData.taxRule,
                        unitPrice: productData.unitPrice,
                        minimumOrder: productData.minimumOrder,
                        userId: productData.userId
                    });
                    await newProduct.save();

                    // Step 2: Save product images
                    if (productData.images && productData.images.length > 0) {
                        const imagePromises = productData.images.map(imageUrl => {
                            return new ProductImages({
                                productId: newProduct._id,
                                Image: imageUrl
                            }).save();
                        });
                        await Promise.all(imagePromises);
                    }

                    // Step 3: Save product availability details
                    const productAvailability = new ProductAvailability({
                        productId: newProduct._id,
                        accept_Order: productData.acceptOrder,
                        available_now: productData.availableNow,
                        available_later: productData.availableLater,
                        made_offer: productData.madeOffer,
                        allow_customization: productData.allowCustomization
                    });
                    await productAvailability.save();

                    // Step 4: Save product tags
                    if (productData.tags && productData.tags.length > 0) {
                        const tagPromises = productData.tags.map(tag => {
                            return new ProductTag({
                                productId: newProduct._id,
                                tag
                            }).save();
                        });
                        await Promise.all(tagPromises);
                    }
                });

                await Promise.all(productPromises);

                // Delete the uploaded file after processing
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error('Error deleting file:', err);
                    }
                });

                res.status(201).json({
                    message: 'Products uploaded successfully!',
                    count: results.length
                });
            } catch (error) {
                console.error('Error saving products:', error);
                res.status(500).json({ message: 'Error saving products to the database.' });
            }
        })
        .on('error', (error) => {
            console.error('Error processing CSV file:', error);
            res.status(500).json({ message: 'Error processing the CSV file.' });
        });
};
