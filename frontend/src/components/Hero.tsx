import hero from "../assets/hero.png";

const Hero = () => {
  return (
    <div>
      <img src={hero} alt="hero" className="w-full max-h-150 object-cover" />
    </div>
  );
};

export default Hero;
