import React, { useState, useEffect } from 'react';
import '../styles/CustomerTournaments.css';

const CustomerTournaments = () => {
    const [tournaments, setTournaments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const tournamentsPerPage = 6;
    const [showRegisterForm, setShowRegisterForm] = useState(false);
    const [selectedTournament, setSelectedTournament] = useState(null);
    const [teamFormData, setTeamFormData] = useState({
        team_name: '',
        captain_name: '',
        members: [{ name: '', number: '', position: '' }]
    });
    const [registeredTeams, setRegisteredTeams] = useState({});

    const fetchRegisteredTeams = async () => {
        try {
            console.log('Fetching registered teams...');
            const response = await fetch('/api/tournaments/teams/my-registrations', {
                credentials: 'include'
            });
            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Received data:', data);
            
            if (response.ok) {
                const teamsMap = {};
                if (Array.isArray(data)) {
                    data.forEach(team => {
                        const tournamentId = team.tournament_id._id || team.tournament_id;
                        if (tournamentId) {
                            teamsMap[tournamentId.toString()] = team.status;
                        }
                    });
                }
                console.log('Processed teams map:', teamsMap);
                setRegisteredTeams(teamsMap);
            } else {
                console.error('Error fetching registered teams:', data.message);
            }
        } catch (error) {
            console.error('Lỗi khi lấy thông tin đội đã đăng ký:', error);
        }
    };

    useEffect(() => {
        fetchTournaments();
        fetchRegisteredTeams();

        // Tạo interval để cập nhật mỗi 30 giây
        const intervalId = setInterval(() => {
            fetchRegisteredTeams();
        }, 30000);

        // Cleanup function
        return () => clearInterval(intervalId);
    }, []);

    const fetchTournaments = async () => {
        try {
            const response = await fetch('/api/tournaments', {
                method: 'GET',
                credentials: 'include'
            });
            const data = await response.json();
            setTournaments(data || []);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách giải đấu:', error);
            setTournaments([]);
        }
    };

    // Tính toán phân trang
    const indexOfLastTournament = currentPage * tournamentsPerPage;
    const indexOfFirstTournament = indexOfLastTournament - tournamentsPerPage;
    const currentTournaments = tournaments.slice(indexOfFirstTournament, indexOfLastTournament);
    const totalPages = Math.ceil(tournaments.length / tournamentsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Hàm thêm thành viên mới
    const handleAddMember = () => {
        setTeamFormData({
            ...teamFormData,
            members: [...teamFormData.members, { name: '', number: '', position: '' }]
        });
    };

    // Hàm xóa thành viên
    const handleRemoveMember = (index) => {
        const newMembers = teamFormData.members.filter((_, i) => i !== index);
        setTeamFormData({
            ...teamFormData,
            members: newMembers
        });
    };

    // Hàm cập nhật thông tin thành viên
    const handleMemberChange = (index, field, value) => {
        const newMembers = teamFormData.members.map((member, i) => {
            if (i === index) {
                return { ...member, [field]: value };
            }
            return member;
        });
        setTeamFormData({
            ...teamFormData,
            members: newMembers
        });
    };

    // Hàm xử lý đăng ký đội
    const handleRegisterTeam = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/tournaments/teams/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    tournament_id: selectedTournament._id,
                    team_name: teamFormData.team_name,
                    captain_name: teamFormData.captain_name,
                    members: teamFormData.members
                })
            });

            const data = await response.json();
            
            if (response.ok) {
                alert('Tạo đội thành công. Chờ phê duyệt từ ban tổ chức!');
                setRegisteredTeams(prev => ({
                    ...prev,
                    [selectedTournament._id]: 'pending'
                }));
                setShowRegisterForm(false);
                setSelectedTournament(null);
                setTeamFormData({
                    team_name: '',
                    captain_name: '',
                    members: [{ name: '', number: '', position: '' }]
                });
            } else {
                alert(data.message || 'Có lỗi xảy ra khi đăng ký đội');
            }
        } catch (error) {
            console.error('Lỗi khi đăng ký đội:', error);
            alert('Có lỗi xảy ra khi đăng ký đội');
        }
    };

    const renderActionButton = (tournament) => {
        const tournamentId = tournament._id.toString();
        const registrationStatus = registeredTeams[tournamentId];
        
        console.log(`Tournament ${tournamentId} status:`, registrationStatus);
        
        // Kiểm tra các trạng thái
        switch(registrationStatus) {
            case 'pending':
                return (
                    <button 
                        className="pending-btn"
                        disabled
                    >
                        Đang Chờ Phê Duyệt
                    </button>
                );
                
            case 'approved':
                return (
                    <button 
                        className="approved-btn"
                        disabled
                    >
                        Đã Tham Gia
                    </button>
                );
                
            default:  // Bao gồm undefined, null và các trường hợp khác
                return (
                    <button 
                        className="join-btn"
                        onClick={() => {
                            setSelectedTournament(tournament);
                            setShowRegisterForm(true);
                        }}
                    >
                        Tham Gia Giải Đấu
                    </button>
                );
        }
    };

    return (
        <div className="customer-tournaments-container">
            <div className="page-header">
                <h1>Giải Đấu Đang Diễn Ra</h1>
            </div>

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
                                <p>
                                    <strong>Phí tham gia:</strong>{' '}
                                    {tournament.fee && tournament.fee.$numberDecimal 
                                        ? `${parseInt(tournament.fee.$numberDecimal).toLocaleString()} VNĐ`
                                        : 'Miễn phí'}
                                </p>
                                <p><strong>Giải thưởng:</strong> {tournament.prize || 'Chưa có thông tin'}</p>
                            </div>
                            <div className="tournament-actions">
                                {renderActionButton(tournament)}
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

            {/* Form đăng ký đội */}
            {showRegisterForm && selectedTournament && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Đăng Ký Đội Tham Gia</h2>
                            <button 
                                className="close-modal"
                                onClick={() => {
                                    setShowRegisterForm(false);
                                    setSelectedTournament(null);
                                    setTeamFormData({
                                        team_name: '',
                                        captain_name: '',
                                        members: [{ name: '', number: '', position: '' }]
                                    });
                                }}
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleRegisterTeam} className="team-register-form">
                            <input
                                type="text"
                                placeholder="Tên đội"
                                value={teamFormData.team_name}
                                onChange={(e) => setTeamFormData({...teamFormData, team_name: e.target.value})}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Tên đội trưởng"
                                value={teamFormData.captain_name}
                                onChange={(e) => setTeamFormData({...teamFormData, captain_name: e.target.value})}
                                required
                            />
                            
                            <div className="members-section">
                                <h3>Danh sách thành viên</h3>
                                {teamFormData.members.map((member, index) => (
                                    <div key={index} className="member-inputs">
                                        <input
                                            type="text"
                                            placeholder="Tên thành viên"
                                            value={member.name}
                                            onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                                            required
                                        />
                                        <input
                                            type="number"
                                            placeholder="Số áo"
                                            value={member.number}
                                            onChange={(e) => handleMemberChange(index, 'number', e.target.value)}
                                            required
                                        />
                                        <input
                                            type="text"
                                            placeholder="Vị trí"
                                            value={member.position}
                                            onChange={(e) => handleMemberChange(index, 'position', e.target.value)}
                                            required
                                        />
                                        {index > 0 && (
                                            <button 
                                                type="button" 
                                                className="remove-member-btn"
                                                onClick={() => handleRemoveMember(index)}
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button 
                                    type="button" 
                                    className="add-member-btn"
                                    onClick={handleAddMember}
                                >
                                    + Thêm thành viên
                                </button>
                            </div>
                            
                            <div className="modal-actions">
                                <button type="submit" className="save-btn">
                                    Đăng Ký Đội
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerTournaments; 