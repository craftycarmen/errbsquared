const StarRating = () => {
    return (
        <div>
            {[...Array(5)].map(star => {
                return (
                    <span>&#9733;</span>
                )
            })}
        </div>
    )
}
