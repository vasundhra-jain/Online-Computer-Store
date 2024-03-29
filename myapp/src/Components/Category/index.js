import "./index.css"

const Category = props => {
    const { categoryDetail } = props
    const { categoryName, image } = categoryDetail
    return (
        <div className="category-item-container">
            <img src={image} alt={categoryName} className="category-item-image"/>
            <h1 className="category-item-name">{categoryName}</h1>
        </div>
    )
}

export default Category