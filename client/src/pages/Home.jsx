import { useEffect, useState, useRef } from "react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import "./Home.css";

function Home() {
  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");

  const [sort, setSort] = useState("");

  const [page, setPage] = useState(1);

  const [pages, setPages] = useState(1);

  const searchRef = useRef(null);

  useEffect(() => {
    fetchProducts();
  }, [search, category, sort, page]);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get(
        `/products?keyword=${search}&category=${category}&sort=${sort}&page=${page}`,
      );

      setProducts(data.products);
      setPages(data.pages);
    } catch (error) {
      console.log(error);
    }
  };

  const changePage = (newPage) => {
    setPage(newPage);

    setTimeout(() => {
      searchRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>Shop Smart. Live Better.</h1>
          <p>Discover amazing products at unbeatable prices.</p>

          <button
            className="hero-btn"
            onClick={() =>
              window.scrollTo({
                top: 500,
                behavior: "smooth",
              })
            }
          >
            Shop Now
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div ref={searchRef} className="search-filter">
        <input
          className="search-input search"
          type="text"
          placeholder="🔍 Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="filter-select"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
        >
          <option value="All">All Categories</option>

          <option value="Mobiles">Mobiles</option>
          <option value="Laptops">Laptops</option>
          <option value="Headphones">Headphones</option>
          <option value="Smart Watches">Smart Watches</option>
          <option value="Shoes">Shoes</option>
          <option value="Fashion">Fashion</option>
          <option value="Gaming">Gaming</option>
          <option value="Books">Books</option>
          <option value="Home">Home</option>
          <option value="Beauty">Beauty</option>
        </select>

        <select
          className="filter-select"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="">Sort By</option>

          <option value="priceLow">Price: Low → High</option>

          <option value="priceHigh">Price: High → Low</option>

          <option value="rating">Top Rated</option>
        </select>
      </div>

      {/* Product Title */}
      <h2 className="section-title">Featured Products</h2>

      {/* Products */}
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        {[...Array(pages).keys()].map((x) => (
          <button
            key={x + 1}
            className={page === x + 1 ? "page-btn active-page" : "page-btn"}
            onClick={() => changePage(x + 1)}
          >
            {x + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Home;
