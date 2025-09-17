import { Button, ButtonText, SectionApp, AppHeader, ModalSm, ModalConfirm } from "@/components";
import { Trash, PaperPlaneTilt, Star, ArrowLeft, ArrowRight } from "phosphor-react";
import { useState, useEffect } from "react";
import ReviewService from "../../../services/ReviewService";

export function Review() {
  return (
    <>
      <SectionApp>
        <AppHeader screenTitle="Avaliações" />
        <CardsWithPaginationAndLocalStorage />
      </SectionApp>
    </>
  );
}

const CardsWithPaginationAndLocalStorage = () => {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const reviewService = new ReviewService();

  const [isModalSmOpen, setIsModalSmOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    loadReviews(currentPage);
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [currentPage]);

  const loadReviews = async (page) => {
    try {
      const response = await reviewService.findAllReviews(page);
      const reviews = response.data.content;
      setTotalPages(response.data.totalPages);

      const itemsIds = reviews.map((review) => ({
        id: review.id,
        nomeCliente: review.nomeAvaliador,
        avaliacao: review.descricao,
        rating: review.nota,
        data: formatDate(review.dataAvaliacao),
      }));

      setItems(itemsIds);

    } catch (error) {
      console.error("Erro ao carregar avaliacoes:", error);
      setItems([]);
    }
  };

  const formatDate = (dateArray) => {
    const [year, month, day] = dateArray;
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
  };

  const deleteReview = async (idDelete) => {
    const response = await reviewService.delete(idDelete);
    console.log(response);

    const updateItems = items.filter(item => item.id !== idDelete);
    setItems(updateItems);
    if (updateItems.length % itemsPerPage == 0 && currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const itemsPerPage = 6;

  const goToPage = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
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

  const openModalConfirm = (reviewContent) => {
    setSelectedReview(reviewContent);
    setIsModalOpen(true);
  };

  const closeModalConfirm = () => {
    setIsModalOpen(false);
    setSelectedReview(null);;
  };


  const getChars = () => {
    if (windowWidth < 380) {
      return 35;
    } else if (windowWidth < 1024) {
      return 70;
    } else {
      return 120;
    }
  };

  const maxChars = getChars();

  return (
    <div className="max-w-lg  lg:max-w-full mx-auto p-4">
      {items.length === 0 && (
        <p className="text-center text-gray-600 mb-4">
          Nenhuma avaliação encontrada.
        </p>
      )}
      <div className=" grid grid-cols-1 lg:grid-cols-2 gap-4 ">
        {items.map((item) => (
          <div key={item.id} className="sm:mx-0 shadow-md p-4 rounded-2xl hover:scale-101 hover:cursor-pointer transition duration-200" onClick={() => openModal(item.avaliacao)}>
            <div className="flex items-center mb-2">
              <div className=" w-16 h-16 rounded-full  bg-gray-50  items-center justify-center"></div>
              <div className="pl-2">
                <p className=" font-bold">{item.nomeCliente}</p>
                <div className="flex">
                  {[...Array(5)].map((_, starIndex) => (
                    starIndex < item.rating ? (
                      <StarFull key={starIndex} />
                    ) : (
                      <Star
                        key={starIndex}
                        weight="regular"
                        size={32}
                        className="text-gray-100 icon"
                      />
                    )
                  ))}
                </div>
              </div>
            </div>
            {item.avaliacao ? <p className=" break-words h-auto lg:h-[10rem] xl:h-[8rem]">{truncateText(item.avaliacao, maxChars)} {item.avaliacao.length > maxChars && (
              <span className="text-red-tx font-bold "> ver mais</span>
            )}</p> : <p className="italic h-auto md:h-[8rem] lg:h-[10rem] text-gray-600 xl:h-[8rem]">Sem descrição</p>}

            <div className="pt-4 flex items-center justify-between">
              <p className="text-gray-600">{item.data}</p>
              <div className="flex ">
                <button onClick={(e) => {
                  e.stopPropagation();
                  openModalConfirm(item.id);
                }} >
                  <Trash size={32} className="text-red-tx cursor-pointer" />
                </button>
                <button onClick={(e) => {
                  e.stopPropagation();

                }} className="bg-red-tx rounded-md px-1 p-0.5  ml-2">
                  <PaperPlaneTilt size={28} className="text-white cursor-pointer" />
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
            disabled={currentPage === 0}
            className="disabled:opacity-50 aspect-square w-auto flex items-center justify-center"
            variant="secondary"
          >
            <ArrowLeft size={20} className="text-black disabled:opacity-50" />
          </Button>

          <span className="text-sm text-gray-600 mx-2">
            {currentPage + 1} de {totalPages}
          </span>

          <Button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
            className="disabled:opacity-50 aspect-square w-auto flex items-center justify-center"
            variant="secondary"
          >
            <ArrowRight size={20} className="text-black disabled:opacity-50" />
          </Button>
        </div>
      )}
      <ModalSm open={isModalSmOpen} onClose={closeModal}>
        {selectedReview ? (
          <div className="">
            <h4 className="text-center">Avaliação</h4>
            <p className="break-words py-3">{selectedReview}</p>
            <div className="flex items-center justify-center">
              <Button onClick={closeModal} variant="secondary">
                <ButtonText className="text-center">
                  Fechar
                </ButtonText>
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-3">
            <h4 className="text-center">Avaliação</h4>
            <p className="italic text-gray-600 py-3">Sem descrição</p>
            <div className="flex items-center justify-center">
              <Button onClick={closeModal} variant="secondary">
                <ButtonText className="text-center">
                  Fechar
                </ButtonText>
              </Button>
            </div>
          </div>
        )}
      </ModalSm>
      <ModalConfirm
        message="Você realmente deseja remover esta avaliação?"
        open={isModalOpen}
        options={["Não", "Sim"]}
        good={false}
        action={() => deleteReview(selectedReview)}
        onClose={() => closeModalConfirm()}
      />
    </div>
  );
};

function StarFull() {
  return (
    <div className="relative w-6 sm:w-8" >
      <Star className="absolute inset-0 text-star icon" weight="fill" />
      <Star className="absolute inset-0 text-star-border icon" weight="regular" />
    </div>
  )
}