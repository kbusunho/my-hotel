const adminService = require('./service');

class AdminController {
  // 대시보드 통계
  async getDashboardStats(req, res) {
    try {
      const stats = await adminService.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: '통계 조회 중 오류가 발생했습니다.' });
    }
  }

  // 사업자 관리
  async getBusinessUsers(req, res) {
    try {
      const businesses = await adminService.getBusinessUsers(req.query);
      res.json(businesses);
    } catch (error) {
      res.status(500).json({ message: '사업자 목록 조회 중 오류가 발생했습니다.' });
    }
  }

  async approveBusiness(req, res) {
    try {
      const user = await adminService.approveBusiness(req.params.id);
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: '사업자 승인 중 오류가 발생했습니다.' });
    }
  }

  async rejectBusiness(req, res) {
    try {
      const user = await adminService.rejectBusiness(req.params.id);
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: '사업자 거부 중 오류가 발생했습니다.' });
    }
  }

  async blockBusiness(req, res) {
    try {
      const user = await adminService.blockBusiness(req.params.id);
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: '사업자 차단 중 오류가 발생했습니다.' });
    }
  }

  // 회원 관리
  async getUsers(req, res) {
    try {
      const users = await adminService.getUsers(req.query);
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: '회원 목록 조회 중 오류가 발생했습니다.' });
    }
  }

  async getUserDetail(req, res) {
    try {
      const result = await adminService.getUserDetail(req.params.id);
      res.json(result);
    } catch (error) {
      if (error.message.includes('찾을 수 없습니다')) {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: '회원 정보 조회 중 오류가 발생했습니다.' });
    }
  }

  async blockUser(req, res) {
    try {
      const user = await adminService.blockUser(req.params.id);
      res.json({ message: '회원이 차단되었습니다.', user });
    } catch (error) {
      if (error.message.includes('찾을 수 없습니다')) {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: '회원 차단 중 오류가 발생했습니다.' });
    }
  }

  async unblockUser(req, res) {
    try {
      const user = await adminService.unblockUser(req.params.id);
      res.json({ message: '회원 차단이 해제되었습니다.', user });
    } catch (error) {
      if (error.message.includes('찾을 수 없습니다')) {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: '회원 차단 해제 중 오류가 발생했습니다.' });
    }
  }

  async deleteUser(req, res) {
    try {
      const result = await adminService.deleteUser(req.params.id);
      res.json(result);
    } catch (error) {
      if (error.message.includes('관리자')) {
        return res.status(403).json({ message: error.message });
      }
      if (error.message.includes('찾을 수 없습니다')) {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: '회원 삭제 중 오류가 발생했습니다.' });
    }
  }

  // 신고된 리뷰 관리
  async getReportedReviews(req, res) {
    try {
      const reviews = await adminService.getReportedReviews();
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: '신고된 리뷰 조회 중 오류가 발생했습니다.' });
    }
  }

  async approveReportedReview(req, res) {
    try {
      const review = await adminService.approveReportedReview(req.params.id);
      res.json(review);
    } catch (error) {
      res.status(500).json({ message: '리뷰 신고 처리 중 오류가 발생했습니다.' });
    }
  }

  async rejectReportedReview(req, res) {
    try {
      const review = await adminService.rejectReportedReview(req.params.id);
      res.json(review);
    } catch (error) {
      res.status(500).json({ message: '리뷰 신고 처리 중 오류가 발생했습니다.' });
    }
  }

  // 전체 리뷰 관리
  async getAllReviews(req, res) {
    try {
      const reviews = await adminService.getAllReviews(req.query);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: '리뷰 목록 조회 중 오류가 발생했습니다.' });
    }
  }

  async deleteReview(req, res) {
    try {
      const result = await adminService.deleteReview(req.params.id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: '리뷰 삭제 중 오류가 발생했습니다.' });
    }
  }

  // 예약 관리
  async getBookings(req, res) {
    try {
      const bookings = await adminService.getBookings(req.query);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: '예약 목록 조회 중 오류가 발생했습니다.' });
    }
  }

  // 호텔 관리
  async getHotels(req, res) {
    try {
      const hotels = await adminService.getHotels(req.query);
      res.json(hotels);
    } catch (error) {
      res.status(500).json({ message: '호텔 목록 조회 중 오류가 발생했습니다.' });
    }
  }

  async deleteHotel(req, res) {
    try {
      const result = await adminService.deleteHotel(req.params.id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: '호텔 삭제 중 오류가 발생했습니다.' });
    }
  }

  // 호텔 태그 관리
  async addHotelTags(req, res) {
    try {
      const hotel = await adminService.addHotelTags(req.params.id, req.body.tags);
      res.json({ message: '태그가 추가되었습니다.', hotel });
    } catch (error) {
      if (error.message.includes('찾을 수 없습니다')) {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: '태그 추가 중 오류가 발생했습니다.' });
    }
  }

  async removeHotelTags(req, res) {
    try {
      const hotel = await adminService.removeHotelTags(req.params.id, req.body.tags);
      res.json({ message: '태그가 제거되었습니다.', hotel });
    } catch (error) {
      if (error.message.includes('찾을 수 없습니다')) {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: '태그 제거 중 오류가 발생했습니다.' });
    }
  }
}

module.exports = new AdminController();
