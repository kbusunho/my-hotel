import { Link } from 'react-router-dom';
import { FaHotel, FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt, FaGithub } from 'react-icons/fa';
import { SiNotion } from 'react-icons/si';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <FaHotel className="text-3xl text-sage-400" />
              <span className="text-2xl font-bold">HotelHub</span>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              최고의 호텔 예약 플랫폼으로 편안한 여행을 계획하세요. 
              전국 최고의 호텔을 한눈에 비교하고 예약하세요.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-sage-400 transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook className="text-xl" />
              </a>
              <a 
                href="https://www.twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-sage-400 transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter className="text-xl" />
              </a>
              <a 
                href="https://www.instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-sage-400 transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className="text-xl" />
              </a>
              <a 
                href="https://www.youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-sage-400 transition-colors"
                aria-label="YouTube"
              >
                <FaYoutube className="text-xl" />
              </a>
              <a 
                href="https://www.notion.so/3-2a9d0bd64ce9800e8d8bd98bd59b0c3e" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-sage-400 transition-colors"
                aria-label="Notion"
              >
                <SiNotion className="text-xl" />
              </a>
              <a 
                href="https://github.com/HotelHub-Team-Project" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-sage-400 transition-colors"
                aria-label="GitHub"
              >
                <FaGithub className="text-xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">빠른 링크</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/search" className="text-gray-300 hover:text-sage-400 transition-colors text-sm">
                  호텔 검색
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="text-gray-300 hover:text-sage-400 transition-colors text-sm">
                  내 예약
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="text-gray-300 hover:text-sage-400 transition-colors text-sm">
                  찜한 호텔
                </Link>
              </li>
              <li>
                <Link to="/business" className="text-gray-300 hover:text-sage-400 transition-colors text-sm">
                  사업자 센터
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-bold mb-4">고객 지원</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/info/about" className="text-gray-300 hover:text-sage-400 transition-colors text-sm">
                  회사 소개
                </Link>
              </li>
              <li>
                <Link to="/info/notice" className="text-gray-300 hover:text-sage-400 transition-colors text-sm">
                  공지사항
                </Link>
              </li>
              <li>
                <Link to="/info/faq" className="text-gray-300 hover:text-sage-400 transition-colors text-sm">
                  자주 묻는 질문
                </Link>
              </li>
              <li>
                <Link to="/info/terms" className="text-gray-300 hover:text-sage-400 transition-colors text-sm">
                  이용 약관
                </Link>
              </li>
              <li>
                <Link to="/info/privacy" className="text-gray-300 hover:text-sage-400 transition-colors text-sm">
                  개인정보 처리방침
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">연락처</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-sage-400 mt-1 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  경기도 남양주시 진접읍 <br />경복대로 425, 창조관 2층
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <FaPhone className="text-sage-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">010-1234-5678</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaEnvelope className="text-sage-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">happysun0142@gmail.com</span>
              </li>
            </ul>
            <div className="mt-4">
              <p className="text-gray-400 text-xs">
                평일: 09:00 - 18:00<br />
                주말 및 공휴일: 휴무
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 HotelHub. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/info/about" className="text-gray-400 hover:text-sage-400 text-sm transition-colors">
                사업자 정보
              </Link>
              <Link to="/info/contact" className="text-gray-400 hover:text-sage-400 text-sm transition-colors">
                제휴 문의
              </Link>
              <Link to="/info/contact" className="text-gray-400 hover:text-sage-400 text-sm transition-colors">
                광고 문의
              </Link>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-gray-500 text-xs">
              (주)호텔허브 | 대표이사: 최길동 | 사업자등록번호: 123-45-67890<br />
              통신판매업신고번호: 제2025-경기남양주시-0000호 | 관광사업자 등록번호: 제2025-000000호
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
