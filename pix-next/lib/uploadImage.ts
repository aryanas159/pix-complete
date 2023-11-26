const uploadImage = async (formData: FormData) => {
    try {
        const imageUploadRes = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_PRODUCT_ENV}/image/upload`,
            {
                method: "POST",
                body: formData,
            }
        );
        const data = await imageUploadRes.json();
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
};
export default uploadImage;