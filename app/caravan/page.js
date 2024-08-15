"use client";
import {
  Button,
  Label,
  Modal,
  Pagination,
  Table,
  TextInput,
} from "flowbite-react";
import moment from "moment-timezone";
import { useEffect, useState } from "react";
import { HiPlus } from "react-icons/hi";
import InputMask from "react-input-mask";

export default function Caravana() {
  //modal
  const [openModal, setOpenModal] = useState(false);

  //forms
  const [date1, setDate1] = useState("");
  const [time1, setTime1] = useState("");
  const [date2, setDate2] = useState("");
  const [time2, setTime2] = useState("");
  const [name1, setName] = useState("");
  const [items, setItems] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  // paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const onPageChange = (page) => setCurrentPage(page);
  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };
  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = items.slice(startIndex, startIndex + itemsPerPage);

  const sortByDate = (a, b) => {
    // funcao pra mudar a ordem pelas datas
    return new Date(b.start_travel) - new Date(a.start_travel);
  };

  const [touched, setTouched] = useState({
    date1: false,
    time1: false,
    date2: false,
    time2: false,
    name1: false,
  });

  // Funções de manipulação de mudanças
  const handleDateChange1 = (event) => {
    const { value } = event.target;
    setDate1(value);
    setTouched((prev) => ({ ...prev, date1: true }));
  };

  const handleTimeChange1 = (event) => {
    const { value } = event.target;
    setTime1(value);
    setTouched((prev) => ({ ...prev, time1: true }));
  };

  const handleDateChange2 = (event) => {
    const { value } = event.target;
    setDate2(value);
    setTouched((prev) => ({ ...prev, date2: true }));
  };

  const handleTimeChange2 = (event) => {
    const { value } = event.target;
    setTime2(value);
    setTouched((prev) => ({ ...prev, time2: true }));
  };

  const handleNameChange = (event) => {
    const { value } = event.target;
    setName(value);
    setTouched((prev) => ({ ...prev, name1: true }));
  };

  // Funções de validação
  const validateDate = (value) => {
    const [day, month, year] = value.split("/").map(Number);
    const date = new Date(year, month - 1, day);
    return (
      !isNaN(date.getTime()) &&
      date.getDate() === day &&
      date.getMonth() + 1 === month &&
      date.getFullYear() === year
    );
  };

  const validateTime = (value) => {
    const [hour, minute] = value.split(":").map(Number);
    return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
  };

  const validateField = (value) => value.trim() !== "";

  // Funções de validação específicas
  const validateForm = () => {
    const errors = {};

    if (touched.date1 && !validateDate(date1)) {
      errors.date1 = "Data da partida inválida";
    }
    if (touched.time1 && !validateTime(time1)) {
      errors.time1 = "Hora da partida inválida";
    }
    if (touched.date2 && !validateDate(date2)) {
      errors.date2 = "Data da chegada inválida";
    }
    if (touched.time2 && !validateTime(time2)) {
      errors.time2 = "Hora da chegada inválida";
    }
    if (touched.name1 && !validateField(name1)) {
      errors.name1 = "Nome é obrigatório";
    }

    setFormErrors(errors);
    setIsFormValid(
      Object.keys(errors).length === 0 &&
        date1 &&
        time1 &&
        date2 &&
        time2 &&
        name1
    );
  };

  // useEffect para validar o formulário em tempo real
  useEffect(() => {
    validateForm();
  }, [date1, time1, date2, time2, name1]);

  // Função para retornar propriedades para o TextInput
  const getInputProps = (field) => ({
    color: formErrors[field] ? "failure" : touched[field] ? "success" : "",
    helperText: formErrors[field] || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    validateForm();
    if (isFormValid) {
      const formData = {
        date1,
        time1,
        date2,
        time2,
        name1,
      };

      try {
        const response = await fetch("/api/caravans", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        // Se a resposta for bem-sucedida
        console.log("Form submitted successfully");
        setOpenModal(false);
        // Limpar campos do formulário
        setDate1("");
        setTime1("");
        setDate2("");
        setTime2("");
        setName("");
        await updateTable();
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    }
  };

  // Função para atualizar a tabela
  const updateTable = async () => {
    try {
      const response = await fetch("/api/caravans");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // popular tabela
  useEffect(() => {
    fetchCaravans();
  }, []);

  const fetchCaravans = async () => {
    try {
      const response = await fetch("/api/caravans");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Função para formatar a data e hora usando moment.js
  const formatDate = (isoString) => {
    return moment.utc(isoString).format("DD/MM/YYYY HH:mm");
  };

  //edicao modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    id: "",
    name: "",
    date1: "",
    time1: "",
    date2: "",
    time2: "",
  });
  const handleEdit = (item) => {
    setEditData({
      id: item.id,
      name: item.name,
      date1: moment(item.start_travel).format("DD/MM/YYYY"),
      time1: moment(item.start_travel).format("HH:mm"),
      date2: moment(item.return_travel).format("DD/MM/YYYY"),
      time2: moment(item.return_travel).format("HH:mm"),
    });
    setEditModalOpen(true);
  };

  return (
    <>
      <section className="">
        <div className="container p-4 mx-auto">
          <div className="flex flex-col mb-4 md:flex-row md:justify-between">
            <h1 className="mb-4 text-3xl font-semibold">Caravanas</h1>
            <Button
              onClick={() => setOpenModal(true)}
              className="w-full h-fit md:w-fit">
              <HiPlus className="w-5 h-5 mr-2" />
              Criar Caravana
            </Button>
          </div>
          {/* modal*/}
          <Modal
            dismissible
            show={openModal}
            onClose={() => setOpenModal(false)}>
            <Modal.Header>Criar Caravana</Modal.Header>
            <form onSubmit={handleSubmit}>
              <Modal.Body>
                <div className="space-y-6">
                  <div className="flex flex-col gap-4">
                    <div>
                      <div className="block mb-2">
                        <Label htmlFor="name1" value="Nome" />
                      </div>
                      <TextInput
                        id="name1"
                        type="text"
                        placeholder="Mês dia-dia"
                        required
                        onChange={handleNameChange}
                        {...getInputProps("name1")}
                      />
                    </div>
                    <div className="flex gap-4">
                      <div className="w-full">
                        <div className="block mb-2">
                          <Label
                            htmlFor="partidadatastart"
                            value="Data da Partida"
                            {...getInputProps("date1")}
                          />
                        </div>
                        <InputMask
                          mask="99/99/9999"
                          value={date1}
                          onChange={handleDateChange1}>
                          {(inputProps) => (
                            <TextInput
                              {...inputProps}
                              id="partidadatastart"
                              placeholder="dd/mm/aaaa"
                              className="block w-full mt-1 form-input"
                              required
                              {...getInputProps("date1")}
                            />
                          )}
                        </InputMask>
                      </div>
                      <div className="w-full">
                        <div className="block mb-2">
                          <Label
                            htmlFor="partidatimestart"
                            value="Hora da Partida"
                            {...getInputProps("time1")}
                          />
                        </div>
                        <InputMask
                          mask="99:99"
                          value={time1}
                          onChange={handleTimeChange1}>
                          {(inputProps) => (
                            <TextInput
                              {...inputProps}
                              id="partidatimestart"
                              placeholder="hh:mm"
                              className="block w-full mt-1 form-input"
                              required
                              {...getInputProps("time1")}
                            />
                          )}
                        </InputMask>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-full">
                        <div className="block mb-2">
                          <Label
                            htmlFor="partidadatafim"
                            value="Data da Chegada"
                            {...getInputProps("date2")}
                          />
                        </div>
                        <InputMask
                          mask="99/99/9999"
                          value={date2}
                          onChange={handleDateChange2}>
                          {(inputProps) => (
                            <TextInput
                              {...inputProps}
                              id="partidadatafim"
                              placeholder="dd/mm/aaaa"
                              className="block w-full mt-1 form-input"
                              required
                              {...getInputProps("date2")}
                            />
                          )}
                        </InputMask>
                      </div>
                      <div className="w-full">
                        <div className="block mb-2">
                          <Label
                            htmlFor="partidatimefim"
                            value="Hora da Chegada"
                            {...getInputProps("time2")}
                          />
                        </div>
                        <InputMask
                          mask="99:99"
                          value={time2}
                          onChange={handleTimeChange2}>
                          {(inputProps) => (
                            <TextInput
                              {...inputProps}
                              id="partidatimefim"
                              placeholder="hh:mm"
                              className="block w-full mt-1 form-input"
                              required
                              {...getInputProps("time2")}
                            />
                          )}
                        </InputMask>
                      </div>
                    </div>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer className="justify-end">
                <Button color="gray" onClick={() => setOpenModal(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={!isFormValid}>
                  Criar Caravana
                </Button>
              </Modal.Footer>
            </form>
          </Modal>

          <div className="overflow-x-auto">
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Nome</Table.HeadCell>
                <Table.HeadCell>Partida</Table.HeadCell>
                <Table.HeadCell>Retorno</Table.HeadCell>
                <Table.HeadCell>
                  <span className="sr-only">Options</span>
                </Table.HeadCell>
              </Table.Head>

              <Table.Body className="divide-y">
                {currentItems.map((item) => (
                  <Table.Row
                    key={item.id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {item.name}
                    </Table.Cell>
                    <Table.Cell>{formatDate(item.start_travel)}</Table.Cell>
                    <Table.Cell>{formatDate(item.return_travel)}</Table.Cell>
                    <Table.Cell>
                      <a
                        href="#"
                        className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                        onClick={() => handleEdit(item)}>
                        Editar
                      </a>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            {/* paginação */}

            <div className="flex mt-4 overflow-x-auto sm:justify-center">
              <Pagination
                layout="pagination"
                currentPage={currentPage}
                totalPages={Math.ceil(items.length / itemsPerPage)}
                onPageChange={onPageChange}
                previousLabel="Anterior"
                nextLabel="Próximo"
                showIcons
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
