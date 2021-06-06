import React from "react";
import {
  FacebookIcon,
  FacebookShareButton,
  FacebookShareCount,
  TwitterIcon,
  TwitterShareButton,
} from "react-share";
import ShareButton from "react-share/lib/ShareButton";
// import {} from "react-icons"

const FacebookShareComponent = (props) => {
  const shareButtonProps = {
    url: "https://github.com/greglobinski/react-custom-share",
    network: "Facebook",
    text: "Give it a try - react-custom-share component",
    longtext:
      "Social sharing buttons for React. Use one of the build-in themes or create a custom one from the scratch.",
  };

  return (
    <>
      <FacebookShareButton
        url={"https://investapp.com/"}
        quote={`Hi Guys! I just bought ${props.boughtValue} ${props.boughtCurrency} for ${props.soldValue} ${props.soldCurrency}! Wanna join me? Check it out on:`}
        hashtag={"#investapp"}
      >
        <div style={{ alignItems: "center" }}>
          <FacebookIcon size={32} round style={{ marginRight: "10px" }} />
          <h2 style={{ display: "inline-block" }}>Share on Facebook</h2>
        </div>
      </FacebookShareButton>
      <TwitterShareButton
        title={`Hi Guys! I just bought ${props.boughtValue} ${props.boughtCurrency} for ${props.soldValue} ${props.soldCurrency}! Wanna join me? Check it out on:`}
        url={"https://investapp.com/"}
        hashtags={["investapp", "bitcoin", "crypto", "stock"]}
      >
        <div style={{ alignItems: "center" }}>
          <TwitterIcon size={32} round style={{ marginRight: "10px" }} />
          <h2 style={{ display: "inline-block" }}>Share on Twitter</h2>
        </div>
      </TwitterShareButton>
    </>
  );
};

export default FacebookShareComponent;
