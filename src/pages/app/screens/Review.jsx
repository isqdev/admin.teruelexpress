import { Button, ButtonText, Image, InputRoot, InputField, InputIcon, InputLabel, InputMessage, SectionApp, AppHeader, Shape, ModalSm } from "@/components";
import {Trash,PaperPlaneTilt, Star } from "phosphor-react";
import { useState, useEffect } from "react";

export function Review() {
  return (
    <>
      <SectionApp>
          <AppHeader screenTitle="Avaliações"/>
          <CardsWithPaginationAndLocalStorage/>
          
      </SectionApp>
    </>
  );
}

const CardsWithPaginationAndLocalStorage = () => {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; 


  const [isModalSmOpen,setIsModalSmOpen] = useState(false);
  const [selectedReview,setSelectedReview ] = useState(null);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const saveReviews = (reviews) => {
    localStorage.setItem('jsonReview', JSON.stringify(reviews));
  }

    const loadReviewsLocalStorage = () => {
      try {
        const storedReviews = localStorage.getItem('jsonReview');
        
        const reviews = JSON.parse(storedReviews);
        const itemsIds = reviews.map((review, index) => ({
          id: index + 1, 
          nomeCliente: 'Nome cliente', 
          avaliacao: review.avaliacao,
          rating: review.rating,
          data: '10/06/2025', 
        }));
        setItems(itemsIds);
        
        
      } catch (error) {
        console.error("Erro ao carregar  'jsonReview' do localStorage:", error);
        setItems([]);
      }
    };
    useEffect(() => {
      loadReviewsLocalStorage();
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    },[]);
    
  const deleteReview = (idDelete) => {
    const updateItems = items.filter(item => item.id !==idDelete);
    setItems(updateItems);
    saveReviews(updateItems);
    if (updateItems.length % itemsPerPage == 0 && currentPage > 1){
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength){
      return text.substring(0,maxLength) + '...';
    }
    return text;
  };

  const openModal = (reviewContent) => {
    setSelectedReview(reviewContent);
    setIsModalSmOpen(true);
  };

  const closeModal = () => {
    setIsModalSmOpen(false);
    setSelectedReview(null);;
  };

  const getChars = () => {
    if (windowWidth < 380) { 
      return 50; 
    } else if (windowWidth < 1024) { 
      return 100; 
    } else {
      return 150; 
    }
  };

  const maxChars = getChars();

  return (
    <div className="max-w-lg  xl:max-w-full mx-auto p-4">
      {items.length === 0 && (
        <p className="text-center text-gray-600 mb-4">
          Nenhuma avaliação encontrada.
        </p>
      )}
      <div className=" grid grid-cols-1 xl:grid-cols-2 gap-4 "> 
        {currentItems.map((item) => (
          <div key={item.id} className="mx-auto sm:mx-0 shadow-md p-4 rounded-2xl"> 
            <div className="flex items-center mb-2">
              <div className=" w-16 h-16 rounded-full  bg-gray-50  items-center justify-center"></div>
              <div className="pl-2">
                <p className=" font-bold">{item.nomeCliente}</p>
                <div className="flex items-center">
                  {[...Array(5)].map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      weight={starIndex < item.rating? "fill" : "regular"} 
                      size={32}
                      className={starIndex < item.rating ? "text-star" : "text-gray-100"}
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className=" break-words h-[6.8rem] ">{truncateText(item.avaliacao, maxChars)} {item.avaliacao.length > maxChars && (
              <button onClick={() => openModal(item.avaliacao)} className="text-blue hover:underline"> Ver mais</button>
            )}</p>
            <div className="pt-4 flex items-center justify-between">
              <p >{item.data}</p> 
              <div className="flex ">
                <button onClick={() => deleteReview(item.id)} >
                  <Trash size={32} className="text-red-tx"/>
                </button>
                <button className="bg-red-tx rounded-md px-1 p-0.5  ml-2">
                  <PaperPlaneTilt size={28} className="text-white"/>
                </button>
              </div>
            </div>
          </div >
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-2 mt-4 justify-end">
          <Button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="border-1 border-black disabled:opacity-50 w-28 h-10 "
          >
            <ButtonText className="text-center disabled:opacity-50">
              Voltar
            </ButtonText>
          </Button>

          <Button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="border-1 border-black disabled:opacity-50 w-28 h-10"
          >
            <ButtonText className="text-center disabled:opacity-50">
              Próximo
            </ButtonText>
          </Button>
        </div>
      )}
      <ModalSm open={isModalSmOpen} onClose={closeModal}>
        {selectedReview && (
          <div className="p-3">
            <h2 className="text-center pb-2">Avaliação</h2>
            <p className=" break-words">{selectedReview}</p>
            <div className="flex items-center justify-center">
              <Button onClick={closeModal} className="border-1 border-black  w-28 h-10">
                <ButtonText className="text-center ">
                  Fechar
                </ButtonText>
              </Button>
            </div>
          </div>
        )}
      </ModalSm>
    </div>
  );
};
