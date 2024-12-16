import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ManageTournaments.css';

const ManageTournaments = () => {
    const navigate = useNavigate();
    const [tournaments, setTournaments] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [selectedTournament, setSelectedTournament] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: '',
        team_limit: '',
        start_date: '',
        end_date: '',
        fee: '',
        prize: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const tournamentsPerPage = 6;
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [showApproveModal, setShowApproveModal] = useState(false);

    // Fetch tất cả giải đấu khi component mount
    useEffect(() => {
        fetchTournaments();
    }, []);

    const fetchTournaments = async () => {
        try {
            const response = await fetch('/api/tournaments', {
                method: 'GET',
                credentials: 'include'
            });
            const tournamentsData = await response.json();
            
            // Kiểm tra và log dữ liệu
            console.log('Raw tournaments data:', tournamentsData);

            // Đảm bảo tournamentsData là một mảng
            const tournamentsArray = Array.isArray(tournamentsData) ? tournamentsData : [];

            // Fetch pending teams cho mỗi giải đấu
            const tournamentsWithTeams = await Promise.all(
                tournamentsArray.map(async (tournament) => {
                    try {
                        const teamsResponse = await fetch(`/api/tournaments/${tournament._id}/pending-teams`, {
                            credentials: 'include'
                        });
                        const teamsData = await teamsResponse.json();
                        return {
                            ...tournament,
                            pendingTeams: teamsData.success ? teamsData.pendingTeams : []
                        };
                    } catch (error) {
                        console.error(`Error fetching teams for tournament ${tournament._id}:`, error);
                        return {
                            ...tournament,
                            pendingTeams: []
                        };
                    }
                })
            );

            console.log('Tournaments with teams:', tournamentsWithTeams);
            setTournaments(tournamentsWithTeams);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách giải đấu:', error);
            setTournaments([]);
        }
    };

    const handleCreateTournament = async (e) => {
        e.preventDefault();
        try {
            const tournamentData = {
                ...formData,
                team_limit: parseInt(formData.team_limit),
                fee: parseFloat(formData.fee) || 0
            };

            const response = await fetch('/api/tournaments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(tournamentData)
            });

            const data = await response.json();
            console.log('Create tournament response:', data);
            
            if (response.status === 201 || response.ok) {
                alert('Tạo giải đấu thành công!');
                setShowCreateForm(false);
                setFormData({
                    name: '',
                    description: '',
                    type: '',
                    team_limit: '',
                    start_date: '',
                    end_date: '',
                    fee: '',
                    prize: ''
                });
                await fetchTournaments();
            } else {
                alert(data.message || 'Có lỗi xảy ra khi tạo giải đấu');
            }
        } catch (error) {
            console.error('Lỗi khi tạo giải đấu:', error);
            alert('Có lỗi xảy ra khi tạo giải đấu');
        }
    };

    const handleDeleteTournament = async (tournamentId) => {
        if (window.confirm('Bạn có chắc muốn xóa giải đấu này?')) {
            try {
                const response = await fetch(`/api/tournaments/${tournamentId}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });
                
                if (response.ok) {
                    alert('Xóa giải đấu thành công!');
                    fetchTournaments(); // Refresh danh sách sau khi xóa
                } else {
                    const data = await response.json();
                    alert(data.message || 'Có lỗi xảy ra khi xóa giải đấu');
                }
            } catch (error) {
                console.error('Lỗi khi xóa giải đấu:', error);
                alert('Có lỗi xảy ra khi xóa giải đấu');
            }
        }
    };

    // Thêm hàm để mở form chỉnh sửa
    const handleEditClick = (tournament) => {
        setSelectedTournament(tournament);
        setFormData({
            ...tournament,
            fee: tournament.fee && tournament.fee.$numberDecimal 
                ? tournament.fee.$numberDecimal 
                : '0',
            start_date: tournament.start_date.split('T')[0],
            end_date: tournament.end_date.split('T')[0],
        });
        setShowEditForm(true);
        setShowCreateForm(false);
    };

    // Thêm hàm xử lý cập nhật giải đấu
    const handleUpdateTournament = async (e) => {
        e.preventDefault();
        try {
            const tournamentData = {
                ...formData,
                team_limit: parseInt(formData.team_limit),
                fee: parseFloat(formData.fee) || 0
            };

            const response = await fetch(`/api/tournaments/${selectedTournament._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(tournamentData)
            });

            const data = await response.json();
            
            if (response.ok) {
                alert('Cập nhật giải đấu thành công!');
                setShowEditForm(false);
                setSelectedTournament(null);
                fetchTournaments();
                setFormData({
                    name: '',
                    description: '',
                    type: '',
                    team_limit: '',
                    start_date: '',
                    end_date: '',
                    fee: '',
                    prize: ''
                });
            } else {
                alert(data.message || 'Có lỗi xảy ra khi cập nhật giải đấu');
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật giải đấu:', error);
            alert('Có lỗi xảy ra khi cập nhật giải đấu');
        }
    };

    // Tính toán các giải đấu cho trang hiện tại
    const indexOfLastTournament = currentPage * tournamentsPerPage;
    const indexOfFirstTournament = indexOfLastTournament - tournamentsPerPage;
    const currentTournaments = tournaments.slice(indexOfFirstTournament, indexOfLastTournament);
    const totalPages = Math.ceil(tournaments.length / tournamentsPerPage);

    // Thêm hàm xử lý chuyển trang
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleViewTeamDetails = (team) => {
        setSelectedTeam(team);
    };

    const handleApproveTeam = async (tournamentId, teamId) => {
        try {
            const response = await fetch('/api/tournaments/teams/approve', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ 
                    tournament_id: tournamentId,
                    team_id: teamId 
                })
            });

            const data = await response.json();
            
            if (response.ok) {
                alert('Phê duyệt đội thành công!');
                fetchTournaments(); // Refresh danh sách
            } else {
                alert(data.message || 'Có lỗi xảy ra khi phê duyệt đội');
            }
        } catch (error) {
            console.error('Lỗi khi phê duyệt đội:', error);
            alert('Có lỗi xảy ra khi phê duyệt đội');
        }
    };

    const handleViewPendingTeams = (tournament) => {
        setSelectedTournament(tournament);
        setShowApproveModal(true);
    };

    return (
        <div className="manage-tournaments-container">
            <div className="page-header">
                <h1>Quản Lý Giải Đấu</h1>
                <button 
                    className="create-tournament-btn"
                    onClick={() => setShowCreateForm(true)}
                >
                    Tạo Giải Đấu Mới
                </button>
            </div>

            {/* Modal tạo giải đấu mới */}
            {showCreateForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Tạo Giải Đấu Mới</h2>
                            <button 
                                className="close-modal"
                                onClick={() => {
                                    setShowCreateForm(false);
                                    setFormData({
                                        name: '',
                                        description: '',
                                        type: '',
                                        team_limit: '',
                                        start_date: '',
                                        end_date: '',
                                        fee: '',
                                        prize: ''
                                    });
                                }}
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleCreateTournament}>
                            <input
                                type="text"
                                placeholder="Tên giải đấu"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                required
                            />
                            <textarea
                                placeholder="Mô tả giải đấu"
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                required
                            />
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({...formData, type: e.target.value})}
                                required
                            >
                                <option value="">Chọn loại giải đấu</option>
                                <option value="Giao hữu">Giao hữu</option>
                                <option value="Chính thức">Chính thức</option>
                                <option value="Từ thiện">Từ thiện</option>
                            </select>
                            <input
                                type="number"
                                placeholder="Số đội tối đa"
                                value={formData.team_limit}
                                onChange={(e) => setFormData({...formData, team_limit: e.target.value})}
                                required
                            />
                            <input
                                type="date"
                                placeholder="Ngày bắt đầu"
                                value={formData.start_date}
                                onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                                required
                            />
                            <input
                                type="date"
                                placeholder="Ngày kết thúc"
                                value={formData.end_date}
                                onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                                required
                            />
                            <input
                                type="number"
                                min="0"
                                placeholder="Phí tham gia (VNĐ)"
                                value={formData.fee}
                                onChange={(e) => setFormData({...formData, fee: Math.max(0, e.target.value)})}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Giải thưởng (VD: 500000 VNĐ + Cúp + Huy chương)"
                                value={formData.prize}
                                onChange={(e) => setFormData({...formData, prize: e.target.value})}
                                required
                            />
                            <div className="modal-actions">
                                <button type="submit" className="save-btn">
                                    Tạo Giải Đấu
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal chỉnh sửa giải đấu */}
            {showEditForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Chỉnh Sửa Giải Đấu</h2>
                            <button 
                                className="close-modal"
                                onClick={() => {
                                    setShowEditForm(false);
                                    setSelectedTournament(null);
                                    setFormData({
                                        name: '',
                                        description: '',
                                        type: '',
                                        team_limit: '',
                                        start_date: '',
                                        end_date: '',
                                        fee: '',
                                        prize: ''
                                    });
                                }}
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleUpdateTournament}>
                            <input
                                type="text"
                                placeholder="Tên giải đấu"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                required
                            />
                            <textarea
                                placeholder="Mô tả giải đấu"
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                required
                            />
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({...formData, type: e.target.value})}
                                required
                            >
                                <option value="">Chọn loại giải đấu</option>
                                <option value="Giao hữu">Giao hữu</option>
                                <option value="Chính thức">Chính thức</option>
                                <option value="Từ thiện">Từ thiện</option>
                            </select>
                            <input
                                type="number"
                                placeholder="Số đội tối đa"
                                value={formData.team_limit}
                                onChange={(e) => setFormData({...formData, team_limit: e.target.value})}
                                required
                            />
                            <input
                                type="date"
                                placeholder="Ngày bắt đầu"
                                value={formData.start_date}
                                onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                                required
                            />
                            <input
                                type="date"
                                placeholder="Ngày kết thúc"
                                value={formData.end_date}
                                onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                                required
                            />
                            <input
                                type="number"
                                min="0"
                                placeholder="Phí tham gia (VNĐ)"
                                value={formData.fee}
                                onChange={(e) => setFormData({...formData, fee: Math.max(0, e.target.value)})}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Giải thưởng (VD: 500000 VNĐ + Cúp + Huy chương)"
                                value={formData.prize}
                                onChange={(e) => setFormData({...formData, prize: e.target.value})}
                                required
                            />
                            <div className="modal-actions">
                                <button type="submit" className="save-btn">
                                    Lưu Thay Đổi
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Danh sách giải đấu */}
            <div className="tournaments-list">
                {tournaments.length > 0 ? (
                    currentTournaments.map(tournament => (
                        <div key={tournament._id} className="tournament-card">
                            <h2>{tournament.name}</h2>
                            <p className="tournament-description">{tournament.description}</p>
                            <div className="tournament-details">
                                <p><strong>Loại giải đấu:</strong> {tournament.type}</p>
                                <p><strong>Số đội tối đa:</strong> {tournament.team_limit}</p>
                                <p><strong>Thời gian:</strong> {new Date(tournament.start_date).toLocaleDateString()} - {new Date(tournament.end_date).toLocaleDateString()}</p>
                                <p><strong>Phí tham gia:</strong> {tournament.fee.$numberDecimal.toLocaleString()} VNĐ</p>
                                <p><strong>Giải thưởng:</strong> {tournament.prize}</p>
                            </div>

                            <div className="tournament-actions">
                                <button 
                                    className="edit-btn"
                                    onClick={() => handleEditClick(tournament)}
                                >
                                    Chỉnh sửa thông tin
                                </button>
                                <button 
                                    className="approve-teams-btn"
                                    onClick={() => handleViewPendingTeams(tournament)}
                                >
                                    Phê duyệt đội
                                </button>
                                <button 
                                    className="delete-btn"
                                    onClick={() => handleDeleteTournament(tournament._id)}
                                >
                                    Xóa giải đấu
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-tournaments">
                        <p>Chưa có giải đấu nào được tạo</p>
                    </div>
                )}
            </div>

            {/* Phân trang */}
            {tournaments.length > tournamentsPerPage && (
                <div className="pagination">
                    <button 
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="page-btn"
                    >
                        &laquo;
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button 
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="page-btn"
                    >
                        &raquo;
                    </button>
                </div>
            )}

            {/* Modal phê duyệt đội */}
            {selectedTournament && showApproveModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Phê Duyệt Đội - {selectedTournament.name}</h2>
                            <button 
                                className="close-modal"
                                onClick={() => {
                                    setShowApproveModal(false);
                                    setSelectedTournament(null);
                                }}
                            >
                                ×
                            </button>
                        </div>
                        <div className="pending-teams-container">
                            {selectedTournament.pendingTeams && selectedTournament.pendingTeams.length > 0 ? (
                                <div className="teams-list">
                                    {selectedTournament.pendingTeams.map(team => (
                                        <div key={team._id} className="team-item">
                                            <div className="team-info">
                                                <h4>{team.name}</h4>
                                                <p><strong>Đội trưởng:</strong> {team.captain_name}</p>
                                                <p><strong>Số thành viên:</strong> {team.members.length}</p>
                                            </div>
                                            <div className="team-actions">
                                                <button 
                                                    className="view-details-btn"
                                                    onClick={() => handleViewTeamDetails(team)}
                                                >
                                                    Xem chi tiết
                                                </button>
                                                <button 
                                                    className="approve-btn"
                                                    onClick={() => handleApproveTeam(selectedTournament._id, team._id)}
                                                >
                                                    Phê duyệt
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="no-pending-teams">Không có đội nào đang chờ phê duyệt</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageTournaments; 