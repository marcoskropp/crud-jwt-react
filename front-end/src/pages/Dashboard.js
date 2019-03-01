import React, { Component } from 'react';
import { Container, Row, Col, Button, Table, Alert, Modal, InputGroup, FormControl } from 'react-bootstrap';
import api from '../services/api';
import socket from 'socket.io-client';
import { FaEdit, FaTrash, FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default class Dashboard extends Component {
    state = {
        users: [],
        page: 1,
        pages: 0,
        accessToken: localStorage.getItem('access_token'),
        modal: false,
        alert: false,
        alertMessage: '',
        alertVariant: '',
        deleteId: '',
        search: '',
        paginate: true,
    };

    async componentDidMount() {
        this.loadUsers();
        this.subscribeToEvents();
    };

    loadUsers = async (atualPage = 1) => {
        const responseUser = await api.get(`/user?page=${atualPage}`, { headers: { "Authorization": this.state.accessToken } });
        const { docs, pages, success } = responseUser.data;
        if (success === false) {
            localStorage.clear();
            this.props.history.push('/');
            return;
        }
        this.setState({ users: docs, page: atualPage, pages, paginate: true });
    };

    nextPage = () => {
        const { page, pages } = this.state;

        if (page === pages) return;

        const pageNumber = page + 1;

        this.loadUsers(pageNumber);
    };

    prevPage = () => {
        const { page } = this.state;

        if (page === 1) return;

        const pageNumber = page - 1;
        this.loadUsers(pageNumber);
    };

    subscribeToEvents = async () => {
        const io = socket('http://localhost:3000');

        io.on('createUser', data => {
            this.setState({ users: [data, ...this.state.users] });
        });

        io.on('updateUser', data => {
            this.setState({
                users: this.state.users.map(user =>
                    user._id === data._id ? data : user
                )
            });
        });

        io.on('removeUser', data => {
            let users = this.state.users.filter(user => user._id !== data._id);
            this.setState({ users });
        });
    };

    handleRemove = async () => {

        this.setState({
            alert: false,
        });

        const responseUser = await api.delete(`/user/${this.state.deleteId}`, { headers: { "Authorization": this.state.accessToken } });

        const { success, message } = responseUser.data;

        if (success) {
            this.setState({
                alertVariant: 'success',
            });
        }

        this.handleCloseModal();

        this.setState({
            alert: true,
            alertMessage: message,
        });
    };

    handleShowModal = _id => () => {
        this.setState({ modal: true, deleteId: _id });
    };

    handleCloseModal = () => {
        this.setState({ modal: false });
    };

    handleLogout = () => {
        localStorage.clear();
        this.props.history.push('/');
    };

    handleInputChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleSearch = async e => {
        if (e.keyCode !== 13) return;

        if (this.state.search === '') {
            this.loadUsers();
            return;
        }

        const responseUser = await api.get(`/users/${this.state.search}`, { headers: { "Authorization": this.state.accessToken } });

        if (responseUser.data === null) return;

        this.setState({ users: responseUser.data, paginate: false });
    };

    render() {
        return (
            <Container className="vertical-align">
                <Row>
                    <Col>
                        <Button variant="btn btn-outline-dark float-right" onClick={this.handleLogout}>
                            Logout
                        </Button>

                        <h1 className="d-flex justify-content-center">DASHBOARD</h1>

                        {
                            this.state.alert &&
                            <Alert variant={this.state.alertVariant} dismissible>
                                {this.state.alertMessage}
                            </Alert>
                        }

                        <Row>
                            <Col sm={10}>
                                <InputGroup className="margin-bot">
                                    <FormControl name="search" placeholder="Pesquisar por nome" onKeyDown={this.handleSearch} onChange={this.handleInputChange} />
                                </InputGroup>
                            </Col>
                            <Col sm={2}>
                                <Button className="margin-bot" variant="btn btn-outline-dark float-right" onClick={this.loadUsers}>
                                    Limpar pesquisa
                                </Button>
                            </Col>
                        </Row>

                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>Email</th>
                                    <th>Data de Nascimento</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.users.map(user => (
                                        <tr key={user._id}>
                                            <td>{user._id}</td>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.dateOfBirth}</td>
                                            <td className="text-center">
                                                <Link className="btn btn-outline-dark" to={`/updateUser/${user._id}`} role="button">
                                                    <FaEdit />
                                                </Link>
                                                <Button variant="btn btn-outline-dark" onClick={this.handleShowModal(user._id)}>
                                                    <FaTrash />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </Table>
                        {this.state.paginate &&
                            <div className="text-center mb-3">
                                <Button variant="btn btn-outline-dark " onClick={this.prevPage}>
                                    <FaChevronLeft />
                                </Button>
                                <Button variant="btn btn-outline-dark" onClick={this.nextPage}>
                                    <FaChevronRight />
                                </Button>
                            </div>
                        }

                        <Modal show={this.state.modal} onHide={this.handleClose}>
                            <Modal.Header>
                                <Modal.Title>Confirmar exclusão</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>Tem certeza que deseja excluir?</Modal.Body>
                            <Modal.Footer>
                                <Button variant="btn btn-outline-dark" onClick={this.handleCloseModal}>
                                    Cancelar
                                </Button>
                                <Button variant="btn btn-dark" onClick={this.handleRemove}>
                                    Confirmar
                                </Button>
                            </Modal.Footer>
                        </Modal>

                    </Col>
                </Row>
            </Container>
        );
    }
}