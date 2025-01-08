import { useEffect, useMemo, useState } from "react"
import Loader from "./Loader";

export function Products() {
    const [productData, setProductData] = useState({ products: [] })

    useEffect(() => {
        fetch('https://dummyjson.com/products')
            .then(res => res.json())
            .then(json => setProductData(json))
    }, []);

    const hasProducts = useMemo(
        () => productData?.products?.length > 0,
        [JSON.stringify(productData.products)]
    )

    return (
        <section>
            { hasProducts ? (
                <ul style={{ padding: 0 }}>
                { productData.products.map(product => (
                    <li key={product.id}>{product.title}</li>
                ))}
                </ul>
            ) : (
                <Loader />
            )}
        </section>
    )
}

export default Products