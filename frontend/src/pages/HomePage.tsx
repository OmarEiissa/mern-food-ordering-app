import SearchBar, { type SearchForm } from "@/components/SearchBar";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const handleSearchSubmit = (searchFormValues: SearchForm) => {
    navigate({
      pathname: `/search/${searchFormValues.searchQuery}`,
    });
  };

  return (
    <div className="flex flex-col gap-12">
      <div className="container mx-auto max-w-4xl px-4 sm:px-8 md:px-24 lg:px-32 bg-white rounded-lg shadow-md py-8 flex flex-col gap-5 text-center -mt-16 ">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-orange-600">
          Tuck into a takeaway today
        </h1>

        <span className="text-sm sm:text-lg md:text-xl lg:text-xl">
          Food is just a click away!
        </span>

        <SearchBar
          placeholder="Search by City or Town"
          onSubmit={handleSearchSubmit}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <img src={"/landing.png"} alt="landing" />

        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <span className="font-bold text-3xl tracking-tight">
            Order takeaway even faster!
          </span>

          <span>
            Download the MernEats App for faster ordering and personalized
            recommendations.
          </span>

          <img src={"/appDownload.png"} alt="app download" />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
