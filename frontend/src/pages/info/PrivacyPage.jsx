export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">개인정보 처리방침</h1>
        
        <div className="prose prose-lg max-w-none">
          <div className="bg-blue-50 p-6 rounded-lg mb-8">
            <p className="text-gray-700 leading-relaxed">
              주식회사 호텔허브(이하 "회사")는 「개인정보 보호법」 제30조에 따라 정보주체의 개인정보를 보호하고 
              이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 다음과 같이 개인정보 처리방침을 수립·공개합니다.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">제1조 (개인정보의 처리 목적)</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 
              이용되지 않으며, 이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 
              필요한 조치를 이행할 예정입니다.
            </p>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>회원 가입 및 관리: 회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 
                  회원자격 유지·관리, 서비스 부정이용 방지, 각종 고지·통지</li>
              <li>재화 또는 서비스 제공: 호텔 예약 서비스 제공, 콘텐츠 제공, 맞춤 서비스 제공, 
                  본인인증, 요금결제·정산</li>
              <li>마케팅 및 광고에의 활용: 신규 서비스 개발 및 맞춤 서비스 제공, 이벤트 및 광고성 정보 제공 및 
                  참여기회 제공, 인구통계학적 특성에 따른 서비스 제공 및 광고 게재</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">제2조 (개인정보의 처리 및 보유 기간)</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-700">
              <li>회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 
                  동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</li>
              <li>각각의 개인정보 처리 및 보유 기간은 다음과 같습니다:
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>회원 정보: 회원 탈퇴 시까지 (단, 관계 법령 위반에 따른 수사·조사 등이 진행중인 경우에는 해당 수사·조사 종료 시까지)</li>
                  <li>예약 정보: 예약 완료 후 5년 (전자상거래 등에서의 소비자보호에 관한 법률)</li>
                  <li>결제 정보: 결제일로부터 5년 (국세기본법, 법인세법)</li>
                  <li>환불 정보: 환불 완료 후 5년 (전자상거래 등에서의 소비자보호에 관한 법률)</li>
                </ul>
              </li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">제3조 (처리하는 개인정보의 항목)</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              회사는 다음의 개인정보 항목을 처리하고 있습니다:
            </p>
            <ol className="list-decimal list-inside space-y-3 text-gray-700">
              <li>회원 가입 및 관리
                <ul className="list-disc list-inside ml-4 mt-2">
                  <li>필수항목: 이메일, 비밀번호, 이름, 휴대전화번호</li>
                  <li>선택항목: 생년월일, 성별</li>
                </ul>
              </li>
              <li>재화 또는 서비스 제공
                <ul className="list-disc list-inside ml-4 mt-2">
                  <li>필수항목: 예약자 정보(이름, 휴대전화번호), 결제정보(카드번호, 유효기간 등)</li>
                </ul>
              </li>
              <li>인터넷 서비스 이용과정에서 자동 생성되는 정보
                <ul className="list-disc list-inside ml-4 mt-2">
                  <li>IP주소, 쿠키, 서비스 이용 기록, 방문 기록</li>
                </ul>
              </li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">제4조 (개인정보의 제3자 제공)</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-700">
              <li>회사는 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며, 
                  정보주체의 동의, 법률의 특별한 규정 등 「개인정보 보호법」 제17조 및 제18조에 해당하는 경우에만 
                  개인정보를 제3자에게 제공합니다.</li>
              <li>회사는 다음과 같이 개인정보를 제3자에게 제공하고 있습니다:
                <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                  <li>제공받는 자: 예약한 숙박시설
                    <br/>제공 목적: 예약 확인 및 숙박 서비스 제공
                    <br/>제공 항목: 예약자 이름, 휴대전화번호, 체크인/체크아웃 날짜, 인원수
                    <br/>보유 및 이용기간: 예약 서비스 제공 완료 시까지
                  </li>
                  <li>제공받는 자: 결제대행사(토스페이먼츠)
                    <br/>제공 목적: 결제 처리
                    <br/>제공 항목: 결제정보(카드번호, 유효기간 등)
                    <br/>보유 및 이용기간: 결제 완료 시까지
                  </li>
                </ul>
              </li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">제5조 (개인정보처리의 위탁)</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>수탁업체: AWS (Amazon Web Services)
                  <br/>위탁업무 내용: 서버 호스팅 및 데이터 보관
                </li>
                <li>수탁업체: 토스페이먼츠
                  <br/>위탁업무 내용: 결제 처리 및 정산
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">제6조 (정보주체의 권리·의무 및 행사방법)</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-700">
              <li>정보주체는 회사에 대해 언제든지 개인정보 열람·정정·삭제·처리정지 요구 등의 권리를 행사할 수 있습니다.</li>
              <li>권리 행사는 회사에 대해 「개인정보 보호법」 시행령 제41조제1항에 따라 서면, 전자우편, 
                  모사전송(FAX) 등을 통하여 하실 수 있으며 회사는 이에 대해 지체 없이 조치하겠습니다.</li>
              <li>권리 행사는 정보주체의 법정대리인이나 위임을 받은 자 등 대리인을 통하여 하실 수 있습니다. 
                  이 경우 "개인정보 처리 방법에 관한 고시(제2020-7호)" 별지 제11호 서식에 따른 위임장을 제출하셔야 합니다.</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">제7조 (개인정보의 파기)</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-700">
              <li>회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 
                  지체없이 해당 개인정보를 파기합니다.</li>
              <li>파기 절차 및 방법:
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>파기절차: 불필요하게 된 개인정보는 별도의 DB로 옮겨져 내부 방침 및 기타 관련 법령에 따라 
                      일정기간 저장된 후 파기됩니다.</li>
                  <li>파기방법: 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제하며, 
                      종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각하여 파기합니다.</li>
                </ul>
              </li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">제8조 (개인정보의 안전성 확보조치)</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>관리적 조치: 내부관리계획 수립·시행, 정기적 직원 교육 등</li>
              <li>기술적 조치: 개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치, 
                  고유식별정보 등의 암호화, 보안프로그램 설치</li>
              <li>물리적 조치: 전산실, 자료보관실 등의 접근통제</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">제9조 (개인정보 보호책임자)</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 
              피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold mb-3">▶ 개인정보 보호책임자</h3>
              <ul className="space-y-1 text-gray-700">
                <li>성명: 김개인</li>
                <li>직책: 정보보호팀장</li>
                <li>연락처: 1588-0000, privacy@hotelhub.com</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">제10조 (개인정보 처리방침 변경)</h2>
            <p className="text-gray-700 leading-relaxed">
              이 개인정보처리방침은 2025년 1월 1일부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 
              있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
            </p>
          </section>

          <section className="bg-gray-50 p-6 rounded-lg">
            <p className="text-gray-700 text-sm">
              본 방침은 2025년 1월 1일부터 시행됩니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
