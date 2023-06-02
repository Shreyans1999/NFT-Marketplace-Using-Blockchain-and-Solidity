import React, { useState, useEffect, useContext } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import axios from "axios";
import { create as ipfsHttpClient } from "ipfs-http-client";

const projectId = "2QeMDmib4Ct39v5GeYt1q1QrgMt";
const projectSecretKey = "fe494fc9341d3471b9822b498cb0e8bb";
const auth = `Basic ${Buffer.from(`${projectId}:${projectSecretKey}`).toString(
  "base64"
)}`;

const subdomain = "https://shreyansmarketplace.infura-ipfs.io";

const client = ipfsHttpClient({
    host: "infura-ipfs.io",
    port: 5001,
    protocol: "https",
    headers: {
      authorization: auth,
    },
});

//INTERNAL  IMPORT
import {
    NFT_mkplaceAddress,
    NFT_mkplaceABI,
    transferFundsAddress,
    transferFundsABI,
  } from "./constants";

//---FETCHING SMART CONTRACT
const fetchContract = (signerOrProvider) =>
  new ethers.Contract(
    NFT_mkplaceAddress,
    NFT_mkplaceABI,
    signerOrProvider
  );

//---CONNECTING WITH SMART CONTRACT

const connectingWithSmartContract = async () => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
  
      const contract = fetchContract(signer);
      return contract;
    } catch (error) {
      console.log("Something went wrong while connecting with contract", error);
    }
};

  export const NFTMarketplaceContext = React.createContext();

  export const NFTMarketplaceProvider = ({ children }) => {
    const titleData = "Discover, collect, and sell NFTs";
    
    //------USESTAT
    const [currentAccount, setCurrentAccount] = useState("");
    const router = useRouter();

    //------CHECK IF WALLET IS CONNECTED
    const checkIfWalletConnected = async () => {
        try {
          if (!window.ethereum)
            return setOpenError(true), setError("Install MetaMask");
    
            const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });

          if (accounts.length) {
            setCurrentAccount(accounts[0]);
            // console.log(accounts[0]);
          } else {
            // setError("No Account Found");
            // setOpenError(true);
            console.log("No account");
          }
          
          } catch (error) { 
          // setError("Something wrong while connecting to wallet");
          // setOpenError(true);
          console.log("NO Account");
        }
    };

    useEffect(() => {
        checkIfWalletConnected();
    }, []);

    //---CONNET WALLET FUNCTION
    const connectWallet = async () => {
        try {
        if (!window.ethereum)
            return setOpenError(true), setError("Install MetaMask");

            const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        });

        console.log(accounts);
        setCurrentAccount(accounts[0]);

        //window.location.reload();
        connectingWithSmartContract();
        } catch (error) {
        // setError("Error while connecting to wallet");
        // setOpenError(true);
        console.log("Error while connecting");
        }
    };

    //---UPLOAD TO IPFS FUNCTION
    const uploadToIPFS = async (file) => {
      try {
        const added = await client.add({ content: file });
        const url = `${subdomain}/ipfs/${added.path}`;
        return url;
      } catch (error) {
        console.log("Error Uploading to IPFS", error);
      }
    };

    //---CREATENFT FUNCTION
    const createNFT = async (name, price, image, description, router) => {
        if (!name || !description || !price || !image)
            return setError("Data Is Missing"), setOpenError(true);

            const data = JSON.stringify({ name, description, image });

        try {
            const added = await client.add(data);
            const url = `https://infura-ipfs.io/ipfs/${added.path}`;

            await createSale(url, price);
            router.push("/searchPage");
        } catch (error) { 
        setError("Error while creating NFT");
        setOpenError(true);
        }
    };

    //--- createSale FUNCTION
    const createSale = async (url, formInputPrice, isReselling, id) => {
        try {
        console.log(url, formInputPrice, isReselling, id);
        const price = ethers.utils.parseUnits(formInputPrice, "ether");

        const contract = await connectingWithSmartContract();

        const listingPrice = await contract.getListingPrice();

        const transaction = !isReselling
            ? await contract.createToken(url, price, {
            value: listingPrice.toString(),
            })
            : await contract.resellToken(id, price, {
            value: listingPrice.toString(),
            });

        await transaction.wait();
        router.push('/searchPage')
        //console.log(transaction);
        } catch (error) {
        setError("error while creating sale");
        setOpenError(true);
        console.log(error);
        }
    };

  //--FETCHNFTS FUNCTION

  const fetchNFTs = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        //--process.env.NEXT_PUBLIC_POLYGON_MUMBAI_RPC
        "https://polygon-mumbai.g.alchemy.com/v2/0awa485pp03Dww2fTjrSCg7yHlZECw-K"
      );

      const contract = fetchContract(provider);

      const data = await contract.fetchMarketItems();

      const items = await Promise.all(
        data.map(
          async ({ tokenId, seller, owner, price: unformattedPrice }) => {
            const tokenURI = await contract.tokenURI(tokenId);

            const {
              data: { image, name, description },
            } = await axios.get(tokenURI, {});
            const price = ethers.utils.formatUnits(
              unformattedPrice.toString(),
              "ether"
            );

            return {
              price,
              tokenId: tokenId.toNumber(),
              seller,
              owner,
              image,
              name,
              description, 
              tokenURI,
            };
          }
        )
      );
      return items;

      // }
    } catch (error) {
      // setError("Error while fetching NFTS");
      // setOpenError(true);
      console.log("Error while fetching NFTS");
    }
  };

  useEffect(() => {
    fetchNFTs();
  }, []);
    
    //--FETCHING MY NFT OR LISTED NFTs
    const fetchMyNFTsOrListedNFTs = async (type) => {
        try {
          if (currentAccount) {
            const contract = await connectingWithSmartContract();
    
            const data =
              type == "fetchItemsListed"
                ? await contract.fetchItemsListed()
                : await contract.fetchMyNFTs();
    
            const items = await Promise.all(
              data.map(
                async ({ tokenId, seller, owner, price: unformattedPrice }) => {
                  const tokenURI = await contract.tokenURI(tokenId);
                  const {
                    data: { image, name, description },
                  } = await axios.get(tokenURI);
                  const price = ethers.utils.formatUnits(
                    unformattedPrice.toString(),
                    "ether"
                  );
    
                  return {
                    price,
                    tokenId: tokenId.toNumber(),
                    seller,
                    owner,
                    image,
                    name,
                    description,
                    tokenURI,
                  };
                }
              )
            );
            return items;
          }
        } catch (error) {
          // setError("Error while fetching listed NFTs");
          // setOpenError(true);
        }
    };
    
    useEffect(() => {
        fetchMyNFTsOrListedNFTs();
    }, []);

    //---BUY NFTs FUNCTION
    const buyNFT = async (nft) => {
        try {
        const contract = await connectingWithSmartContract();
        const price = ethers.utils.parseUnits(nft.price.toString(), "ether");

        const transaction = await contract.createMarketSale(nft.tokenId, {
        value: price,
        });

        await transaction.wait();
        router.push("/author");
        } catch (error) {
        setError("Error While buying NFT");
        setOpenError(true);
        }
    };


    return (
    <NFTMarketplaceContext.Provider 
        value ={{
            connectWallet,
            fetchNFTs,
            fetchMyNFTsOrListedNFTs,
            checkIfWalletConnected,
            uploadToIPFS,
            createNFT,
            buyNFT,
            createSale,
            currentAccount,
            titleData,
        }}
    >
        {children}
    </NFTMarketplaceContext.Provider>
    );
};
