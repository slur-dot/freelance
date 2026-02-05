import { useNavigate } from "react-router-dom";
import LaptopImage from "../assets/Laptop.jpg";

const ComputerRentalProducts = () => {
  const navigate = useNavigate();

  const products = [
    {
      id: 1,
      name: "Basic Laptop",
      hourlyPrice: "8,800 GNF",
      dailyPrice: "70,400 GNF",
      image: LaptopImage,
    },
    {
      id: 2,
      name: "Standard Laptop",
      hourlyPrice: "12,000 GNF",
      dailyPrice: "96,000 GNF",
      image: LaptopImage,
    },
    {
      id: 3,
      name: "Premium Laptop",
      hourlyPrice: "15,000 GNF",
      dailyPrice: "120,000 GNF",
      image: LaptopImage,
    },
  ];

  const handleBooking = (product) => {
    navigate("/computer-rental/booking", { state: product });
  };

  return (
    <div>
      {/* Full-Width Breadcrumb */}
      <div className="w-full border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-20 py-2 sm:py-3 flex items-center text-xs sm:text-sm text-gray-500">
          <span>Home</span>
          <span className="mx-1 sm:mx-2">{">"}</span>
          <span>Computer Rentals</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-20 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold mb-3 md:mb-0">Rental Products</h1>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-xl overflow-hidden shadow-md bg-white cursor-pointer"
              onClick={() => handleBooking(product)}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 sm:h-44 md:h-48 object-cover rounded-t-xl"
              />
              <div className="p-3 sm:p-4">
                <h2 className="text-base sm:text-lg font-semibold mb-2">{product.name}</h2>
                <div className="text-gray-700 text-xs sm:text-sm mb-1">
                  <span className="font-bold text-sm sm:text-base">{product.hourlyPrice}</span> /hour
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-2 gap-2">
                  <div className="text-gray-700 text-xs sm:text-sm">
                    <span className="font-bold text-sm sm:text-base">{product.dailyPrice}</span> /day
                  </div>
                  <button
                    className="bg-[#22C55E] hover:bg-[#16A34A] text-white rounded-lg py-2 px-4 text-xs sm:text-sm w-full sm:w-auto md:w-[160px]"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBooking(product);
                    }}
                  >
                    Rent it Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComputerRentalProducts;
