import "../styles/globals.css";

//INTRNAL IMPORT
import { NavBar, Footer } from "../components/componentsindex";
import { NFTMarketplaceProvider } from "../Context/NFTMarketplaceContext";

const MyApp = ({ Component, pageProps }) => (
  <NFTMarketplaceProvider>
    
      <NavBar />
      <Component {...pageProps} />
      <Footer />
    
  </NFTMarketplaceProvider>
);

export default MyApp;