import React, { Component, useContext } from "react";
import { createGlobalStyle } from "styled-components";
import FileReaderInput from "react-file-reader-input";
import { ReactReader } from "./modules";
import axios from 'axios';
import {
  Container,
  ReaderContainer,
  Bar,
  LogoWrapper,
  Logo,
  GenericButton,
  CloseIcon,
  FontSizeButton,
  ButtonWrapper
} from "./Components";
import { AuthContext } from '../../Context/AuthContext';
import queryString from 'query-string';

const storage = global.localStorage || null;

//var DEMO_URL = '';

const urlParams = new URLSearchParams(window.location.search)


var DEMO_URL = "https://incribobucket1.s3.us-east-2.amazonaws.com/ebooks/Admin+Incribo/Apps/gutenberg/A+Bad+Day+for+Vermin+by+Keith+Laumer.epub"
//"https://incribobucket1.s3.us-east-2.amazonaws.com/ebooks/Admin+Incribo/Apps/gutenberg/A+Bad+Day+for+Vermin+by+Keith+Laumer.epub"
 //ebookURL
//"https://incribobucket1.s3.us-east-2.amazonaws.com/ebooks/Admin%20Incribo/Apps/gutenberg/A%20Damsel%20in%20Distress%20by%20P.%20G.%20Wodehouse.epub?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAI4Z6FJ6AIL7ZW3IA%2F20200614%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20200614T100702Z&X-Amz-Expires=900&X-Amz-Signature=3640cb15b58db710a714f57922ecaf828bf5e24d2827efd381635dda9f3ea01b&X-Amz-SignedHeaders=host"
//"https://gerhardsletten.github.io/react-reader/files/alice.epub";
const DEMO_NAME = //urlParams.get("query").split("/")[4].split("by")[0];
"Alice in wonderland";

const GlobalStyle = createGlobalStyle`
  * {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    margin: 0;
    padding: 0;
    color: inherit;
    font-size: inherit;
    font-weight: 300;
    line-height: 1.4;
    word-break: break-word;
  }
  html {
    font-size: 62.5%;
  }
  body {
    margin: 0;
    padding: 0;
    min-height: 100vh;
    font-size: 1.8rem;
    background: #333;
    position: absolute;
    height: 100%;
    width: 100%;
    color: #fff;
  }
`;


export default class EbookReader extends Component {

  
    constructor(props) {
        super(props)
        console.log(props.location.state.detail)
        axios.post('https://stormy-ravine-61146.herokuapp.com/api/aws/new2', props.location.state.detail)
          .then(res => {
            console.log(res.data.url);
            if(res.data.success) {
              DEMO_URL = res.data.url
              //console.log("https://gerhardsletten.github.io/react-reader/files/alice.epub")
              console.log(DEMO_URL)
            }
            else{
              alert('Error in getting Url');
            }
          })
        this.state = {
          fullscreen: true,
          location:
            storage && storage.getItem("epub-location")
              ? storage.getItem("epub-location")
              : 2,
          localFile: null,
          localName: null,
          largeText: false
        };
        this.rendition = null;
    }
    toggleFullscreen = () => {
        this.setState(
          {
            fullscreen: !this.state.fullscreen
          },
          () => {
            setTimeout(() => {
              const evt = document.createEvent("UIEvents");
              evt.initUIEvent("resize", true, false, global, 0);
            }, 1000);
          }
        );
      };

      onLocationChanged = location => {
        this.setState(
          {
            location
          },
          () => {
            storage && storage.setItem("epub-location", location);
          }
        );
      };

      onToggleFontSize = () => {
        const nextState = !this.state.largeText;
        this.setState(
          {
            largeText: nextState
          },
          () => {
            this.rendition.themes.fontSize(nextState ? "140%" : "100%");
          }
        );
      };

      getRendition = rendition => {
        // Set inital font-size, and add a pointer to rendition for later updates
        const { largeText } = this.state;
        this.rendition = rendition;
        rendition.themes.fontSize(largeText ? "140%" : "100%");
        
      };

      handleChangeFile = (event, results) => {
        if (results.length > 0) {
          const [e, file] = results[0];
          if (file.type !== "application/epub+zip") {
            return alert("Unsupported type");
          }
          this.setState({
            localFile: e.target.result,
            localName: file.name,
            location: null
          });
        }
      };

      render() {
       // const queryStrObj = queryString.parse(this.props.location.search)
        const { fullscreen, location, localFile, localName } = this.state;
        return (
          <Container>
            <GlobalStyle />
            <Bar>
              <ButtonWrapper>
                <FileReaderInput as="buffer" onChange={this.handleChangeFile}>
                  <GenericButton>Upload local epub</GenericButton>
                </FileReaderInput>
                <GenericButton onClick={this.toggleFullscreen}>
                  Use full browser window
                  <CloseIcon />
                </GenericButton>
              </ButtonWrapper>
            </Bar>
            <ReaderContainer fullscreen={fullscreen}>
            {
              // <ReactReader 
              //   url={localFile || DEMO_URL }
              //   title={localName || DEMO_NAME}
              //   location={location}
              //   locationChanged={this.onLocationChanged}
              //   getRendition={this.getRendition}
              // />
            }
            <ReactReader 
                url = "https://incribobucket1.s3.us-east-2.amazonaws.com/ebooks/Admin+Incribo/Apps/gutenberg/A+Book+on+Vegetable+Dyes+by+Ethel+Mairet.epub"
                //"https://incribobucket1.s3.us-east-2.amazonaws.com/ebooks/Admin%20Incribo/Apps/gutenberg/%241_000%20a%20Plate%20by%20Jack%20McKenty.epub?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAI4Z6FJ6AIL7ZW3IA%2F20200808%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20200808T000813Z&X-Amz-Expires=900&X-Amz-Signature=ac078cbc53f3f0771407acff610fd17a42c448f497afa7496b4fcd6dbd34b250&X-Amz-SignedHeaders=host"
                //{DEMO_URL}
                //{localFile || DEMO_URL }
                title={localName || DEMO_NAME}
                location={location}
                locationChanged={this.onLocationChanged}
                getRendition={this.getRendition}
              />
              <FontSizeButton onClick={this.onToggleFontSize}>
                Toggle font-size
              </FontSizeButton>
            </ReaderContainer>
          </Container>
        );
      }
}
