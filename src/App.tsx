import { useEffect, useState } from "react";
import * as C from "./App.styles";
import logoImage from "./assets/devmemory_logo.png";
import { Button } from "./components/Button";
import { InfoItem } from "./components/InfoItem";
import RestartIcon from "./svgs/restart.svg";
import { GridItemType } from "./types/GridItemType";
import { items } from "./data/items";
import { GridItem } from "./components/GridItem";
import { formatTimeElapsed } from "./helpers/formatTimeElapsed";
import { stringify } from "querystring";


const App = () => {

  const [playing, setPlaying] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [moveCount, setMoveCount] = useState<number>(0);
  const [showCount, setShowCount] = useState<number>(0);
  const [gridItems, setGridItems] = useState<GridItemType[]>([]);

  //VERIFICAR QUANDO O GAMER ACABA
  useEffect(() => {
    if(moveCount > 0 && gridItems.every(item => item.permanentShown === true)){
      setPlaying(false);
    }
  }, [moveCount, gridItems]);

  //verificar se os abertos são iguais;
  useEffect(() => {
    if(showCount === 2){
      let opened = gridItems.filter(item => item.shown === true);
      if(opened.length === 2){
        
        //VERIFICAÇÃO 1 = SE ELES SÃO IGUAIS, TORNAREM PERMANENTES
        if(opened[0].item === opened[1].item){
          let tmpGrid = [...gridItems];
          for(let i in tmpGrid){
            if(tmpGrid[i].shown){
              tmpGrid[i].permanentShown = true;
              tmpGrid[i].shown = false;
            }
          }
          setGridItems(tmpGrid);
          setShowCount(0);
        }else{
          //V2 - SE NÃO FOR IGUAIS, FECHA ELES
         setTimeout(() => {
          let tmpGrid = [...gridItems];
          for(let i in tmpGrid){
            tmpGrid[i].shown = false;
          }
          setGridItems(tmpGrid);
          setShowCount(0);
         }, 1000);
        }
        
        setMoveCount(moveCount => moveCount + 1);
      }
    }
  }, [showCount, gridItems]);

  useEffect(() => {
    resetAndCreatedGrid();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if(playing){
        setTimeElapsed(timeElapsed + 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [playing, timeElapsed]);

  const resetAndCreatedGrid = () => {
    //PASSO 1 - RESETAR O JOGO
    setTimeElapsed(0);
    setMoveCount(0);
    setShowCount(0);

    //PASSO 2 - CRIAR O GRID E COMEÇAR O JOGO
    //2.1 - CRIAR UM GRID VAZIO
    let tempGrid: GridItemType[] = [];
    for(let i = 0; i < (items.length * 2); i++){
      tempGrid.push({
        item: null,
        shown: false,
        permanentShown: false
      });
    }
    //2.2 - PREENCHER O GRID
    for(let w = 0; w < 2; w++){
      for(let i = 0; i < items.length; i++){
        let pos = -1;
        while(pos < 0 || tempGrid[pos].item !== null){
          pos = Math.floor(Math.random() * (items.length * 2));
        }
        tempGrid[pos].item = i;
      }
    }

    //2.3 - JOGAR NO STATE
    setGridItems(tempGrid);

    //PASSO 3 - COMEÇAR O JOGO
    setPlaying(true);
  }

  const handleItemClick = (index: number) => {
    if(playing && index !== null && showCount < 2){
      let tmpGrid = [...gridItems];

      if(tmpGrid[index].permanentShown === false &&  tmpGrid[index].shown === false){
        tmpGrid[index].shown = true;
        setShowCount(showCount + 1);
      }

      setGridItems(tmpGrid);
    }
  }

  return (
    <C.Container>
      <C.Info>
        <C.LogoLink href="">
          <img src={ logoImage } width='200' alt="" />
        </C.LogoLink>
        <C.InfoArea>
          <InfoItem label="Tempo" value={ formatTimeElapsed(timeElapsed) } />
          <InfoItem label="Movimentos" value={ String(moveCount) }/>
        </C.InfoArea>
        <Button label="Reiniciar" icon={ RestartIcon } onClick={ resetAndCreatedGrid }/>
      </C.Info>
      <C.GridArea>
        <C.Grid>
          { gridItems.map((item, index) => (
            <GridItem 
              key={ index }
              item={ item }
              onClick={ () => handleItemClick(index) }
            />
          )) }
        </C.Grid>
      </C.GridArea>
    </C.Container>
  );
}

export default App;