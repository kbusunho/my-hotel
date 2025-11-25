const nodemailer = require('nodemailer');

// 이메일 전송 설정
const transporter = nodemailer.createTransport({
  service: 'gmail', // 또는 다른 이메일 서비스
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// 예약 확인 이메일
exports.sendBookingConfirmation = async (booking, user, hotel, room) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `[HotelHub] 예약이 확인되었습니다 - ${hotel.name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #7c9885; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 20px; }
            .info-box { background-color: white; padding: 15px; margin: 10px 0; border-left: 4px solid #7c9885; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .button { background-color: #7c9885; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>예약이 확인되었습니다!</h1>
            </div>
            <div class="content">
              <p>안녕하세요, ${user.name}님!</p>
              <p>HotelHub에서 예약이 성공적으로 완료되었습니다.</p>
              
              <div class="info-box">
                <h3>예약 정보</h3>
                <p><strong>예약 번호:</strong> ${booking._id.toString().slice(-8).toUpperCase()}</p>
                <p><strong>호텔:</strong> ${hotel.name}</p>
                <p><strong>객실:</strong> ${room.name}</p>
                <p><strong>체크인:</strong> ${new Date(booking.checkIn).toLocaleDateString('ko-KR')} 15:00 이후</p>
                <p><strong>체크아웃:</strong> ${new Date(booking.checkOut).toLocaleDateString('ko-KR')} 11:00 이전</p>
                <p><strong>투숙객:</strong> 성인 ${booking.guests.adults}명, 아동 ${booking.guests.children}명</p>
              </div>

              <div class="info-box">
                <h3>결제 정보</h3>
                <p><strong>총 결제 금액:</strong> ₩${(booking.totalPrice - (booking.discount || 0)).toLocaleString()}</p>
                <p><strong>결제 방법:</strong> ${booking.paymentMethod === 'card' ? '카드 결제' : '현장 결제'}</p>
              </div>

              ${booking.specialRequests ? `
              <div class="info-box">
                <h3>특별 요청사항</h3>
                <p>${booking.specialRequests}</p>
              </div>
              ` : ''}

              <center>
                <a href="${process.env.FRONT_ORIGIN}/user/my-bookings" class="button">예약 내역 확인하기</a>
              </center>

              <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                <strong>안내사항:</strong><br>
                • 체크인 시 예약 확인서와 신분증을 제시해주세요.<br>
                • 예약 변경 및 취소는 웹사이트에서 가능합니다.<br>
                • 문의사항: help@hotelhub.com | 1588-0000
              </p>
            </div>
            <div class="footer">
              <p>© 2025 HotelHub. All rights reserved.</p>
              <p>이 이메일은 발신 전용입니다. 답장하지 마세요.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ 예약 확인 이메일 전송 완료:', user.email);
  } catch (error) {
    console.error('❌ 이메일 전송 실패:', error);
  }
};

// 체크인 리마인더 이메일
exports.sendCheckInReminder = async (booking, user, hotel, room) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `[HotelHub] 내일은 체크인 날입니다 - ${hotel.name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #7c9885; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 20px; }
            .info-box { background-color: white; padding: 15px; margin: 10px 0; border-left: 4px solid #7c9885; }
            .highlight { background-color: #fff3cd; padding: 15px; border-radius: 4px; margin: 15px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏨 내일은 체크인 날입니다!</h1>
            </div>
            <div class="content">
              <p>안녕하세요, ${user.name}님!</p>
              <p>즐거운 여행을 준비하고 계신가요?</p>
              
              <div class="highlight">
                <h3 style="margin-top: 0;">체크인 안내</h3>
                <p><strong>날짜:</strong> ${new Date(booking.checkIn).toLocaleDateString('ko-KR')} (내일)</p>
                <p><strong>시간:</strong> 15:00 이후</p>
                <p><strong>장소:</strong> ${hotel.name}</p>
                <p><strong>주소:</strong> ${hotel.location?.address}</p>
              </div>

              <div class="info-box">
                <h3>예약 정보</h3>
                <p><strong>예약 번호:</strong> ${booking._id.toString().slice(-8).toUpperCase()}</p>
                <p><strong>객실:</strong> ${room.name}</p>
                <p><strong>숙박 기간:</strong> ${new Date(booking.checkIn).toLocaleDateString('ko-KR')} ~ ${new Date(booking.checkOut).toLocaleDateString('ko-KR')}</p>
              </div>

              <p><strong>체크인 시 필요한 것:</strong></p>
              <ul>
                <li>예약 확인서 (이메일 또는 모바일)</li>
                <li>신분증 (주민등록증, 운전면허증, 여권 등)</li>
                <li>결제 카드 (현장 결제 시)</li>
              </ul>

              <p style="margin-top: 30px; color: #666;">
                즐거운 여행 되시길 바랍니다! 😊<br>
                문의사항이 있으시면 언제든지 연락 주세요.
              </p>
            </div>
            <div class="footer">
              <p>© 2025 HotelHub. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ 체크인 리마인더 이메일 전송 완료:', user.email);
  } catch (error) {
    console.error('❌ 이메일 전송 실패:', error);
  }
};

// 예약 취소 이메일
exports.sendCancellationConfirmation = async (booking, user, hotel) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `[HotelHub] 예약이 취소되었습니다 - ${hotel.name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #dc3545; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 20px; }
            .info-box { background-color: white; padding: 15px; margin: 10px 0; border-left: 4px solid #dc3545; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>예약이 취소되었습니다</h1>
            </div>
            <div class="content">
              <p>안녕하세요, ${user.name}님</p>
              <p>다음 예약이 취소되었습니다.</p>
              
              <div class="info-box">
                <p><strong>예약 번호:</strong> ${booking._id.toString().slice(-8).toUpperCase()}</p>
                <p><strong>호텔:</strong> ${hotel.name}</p>
                <p><strong>체크인 예정:</strong> ${new Date(booking.checkIn).toLocaleDateString('ko-KR')}</p>
              </div>

              <p>환불 처리는 영업일 기준 3-5일 소요됩니다.</p>
              <p>다음에 더 좋은 서비스로 찾아뵙겠습니다.</p>
            </div>
            <div class="footer">
              <p>© 2025 HotelHub. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ 예약 취소 이메일 전송 완료:', user.email);
  } catch (error) {
    console.error('❌ 이메일 전송 실패:', error);
  }
};
