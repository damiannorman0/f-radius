import {useEffect, useState} from 'react';
import styled from 'styled-components/macro';
import logo from './logo.svg';
import './App.css';
import {analyze} from './utils';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  background-color: lightblue;
  padding: 30px;
  color: black;
`;

const StyledInput = styled.input`
  padding: 10px;
  margin: 10px;
  color: white;
  font-size: medium;
  border-radius: 5px;
  border: none;
  text-align: center;
`;

const StyledInputContainer = styled.div`
  padding: 10px;
  margin: 10px;
  background-color: black;
  border-radius: 10px;
`;

function App() {
  const [file, setFile] = useState();
  const [result, setResult] = useState();

  useEffect(() => {
    if(!file) {
      return;
    }
    const get = async () => {
      const analyzed = await analyze(file);
      setResult(analyzed);
    };

    get();
  }, [file]);

  const onFileType = (e) => {
    const {
      target: {
        files = [],
      } = {},
    } = e;
    const tmppath = URL.createObjectURL(files[0]);
    setFile(tmppath);
  };

  const { triangles, surfaceArea } = result || {};
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          STL Analysis
        </p>
        <StyledContainer>
          <StyledInputContainer>
            <StyledInput type="file" accept=".stl" onChange={onFileType} />
          </StyledInputContainer>
          {!result && <p>Choose file to begin parsing...</p>}
          {result && (
            <>
              <div>Triangles: {triangles}</div>
              <div>Surface Area: {surfaceArea}</div>
            </>
          )}
        </StyledContainer>
      </header>
    </div>
  );
}

export default App;
