import { FaPrint } from 'react-icons/fa';

export default function PrintableBooking({ booking }) {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const bookingDetails = generatePrintContent(booking);
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>예약 확인서 - ${booking._id?.slice(-8).toUpperCase()}</title>
        <style>
          @media print {
            @page { margin: 2cm; }
            body { font-family: Arial, sans-serif; }
          }
          body { padding: 20px; }
          .header { border-bottom: 3px solid #4a7c59; padding-bottom: 20px; margin-bottom: 20px; }
          .title { font-size: 28px; font-weight: bold; color: #4a7c59; margin-bottom: 8px; }
          .booking-number { background: #f0f9f4; padding: 15px; border-radius: 8px; margin-top: 15px; }
          .section { margin: 25px 0; }
          .section-title { font-size: 18px; font-weight: bold; color: #333; margin-bottom: 12px; border-bottom: 1px solid #ddd; padding-bottom: 8px; }
          .info-row { display: flex; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
          .info-label { width: 150px; color: #666; font-weight: 500; }
          .info-value { flex: 1; color: #333; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #ddd; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        ${bookingDetails}
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const generatePrintContent = (booking) => {
    const checkInDate = new Date(booking.checkIn).toLocaleDateString('ko-KR');
    const checkOutDate = new Date(booking.checkOut).toLocaleDateString('ko-KR');
    const hotelName = booking.hotel?.name || '호텔 정보 없음';
    const roomName = booking.room?.name || '객실 정보 없음';
    
    return `
      <div class="header">
        <div class="title">HotelHub 예약 확인서</div>
        <div style="color: #666;">Booking Confirmation</div>
        <div class="booking-number">
          <div style="font-size: 12px; color: #666; margin-bottom: 5px;">예약 번호 / Booking Number</div>
          <div style="font-size: 22px; font-weight: bold; color: #4a7c59;">${booking._id?.slice(-8).toUpperCase() || 'N/A'}</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">호텔 정보 / Hotel Information</div>
        <div class="info-row">
          <div class="info-label">호텔명</div>
          <div class="info-value">${hotelName}</div>
        </div>
        <div class="info-row">
          <div class="info-label">객실</div>
          <div class="info-value">${roomName}</div>
        </div>
        <div class="info-row">
          <div class="info-label">주소</div>
          <div class="info-value">${booking.hotel?.location?.address || '주소 정보 없음'}</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">투숙 일정 / Schedule</div>
        <div class="info-row">
          <div class="info-label">체크인</div>
          <div class="info-value">${checkInDate} 15:00</div>
        </div>
        <div class="info-row">
          <div class="info-label">체크아웃</div>
          <div class="info-value">${checkOutDate} 11:00</div>
        </div>
        <div class="info-row">
          <div class="info-label">투숙객</div>
          <div class="info-value">성인 ${booking.guests?.adults || 0}명, 어린이 ${booking.guests?.children || 0}명</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">결제 정보 / Payment Details</div>
        <div class="info-row">
          <div class="info-label">객실 요금</div>
          <div class="info-value">₩${booking.totalPrice?.toLocaleString() || 0}</div>
        </div>
        <div class="info-row">
          <div class="info-label">할인</div>
          <div class="info-value">-₩${booking.discountAmount?.toLocaleString() || 0}</div>
        </div>
        <div class="info-row" style="font-weight: bold; font-size: 16px; border-bottom: 2px solid #4a7c59;">
          <div class="info-label">총 결제 금액</div>
          <div class="info-value" style="color: #4a7c59;">₩${booking.finalPrice?.toLocaleString() || 0}</div>
        </div>
      </div>

      ${booking.specialRequests ? `
      <div class="section">
        <div class="section-title">특별 요청 사항 / Special Requests</div>
        <div style="padding: 10px; background: #f9f9f9; border-radius: 5px;">
          ${booking.specialRequests}
        </div>
      </div>
      ` : ''}

      <div class="footer">
        <p style="margin: 5px 0;">HotelHub | 고객센터: 1588-0000 | support@hotelhub.com</p>
        <p style="margin: 5px 0;">본 예약 확인서는 체크인 시 제시해주세요.</p>
        <p style="margin: 5px 0;">Please present this confirmation at check-in.</p>
      </div>
    `;
  };

  return (
    <button
      onClick={handlePrint}
      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
    >
      <FaPrint className="mr-2" />
      인쇄
    </button>
  );
}
