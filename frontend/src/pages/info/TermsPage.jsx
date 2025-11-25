export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">이용약관</h1>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">제1조 (목적)</h2>
            <p className="text-gray-700 leading-relaxed">
              본 약관은 주식회사 호텔허브(이하 "회사")가 운영하는 HotelHub 웹사이트(이하 "사이트")에서 
              제공하는 호텔 예약 중개 서비스(이하 "서비스")의 이용과 관련하여 회사와 회원 간의 권리, 
              의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">제2조 (용어의 정의)</h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              본 약관에서 사용하는 용어의 정의는 다음과 같습니다:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>"회원"이라 함은 본 약관에 동의하고 회사가 제공하는 서비스를 이용하는 자를 말합니다.</li>
              <li>"아이디(ID)"라 함은 회원의 식별과 서비스 이용을 위하여 회원이 설정하고 회사가 승인한 이메일 주소를 말합니다.</li>
              <li>"비밀번호"라 함은 회원의 개인정보 보호를 위해 회원이 설정한 문자와 숫자의 조합을 말합니다.</li>
              <li>"예약"이라 함은 회원이 사이트를 통하여 숙박시설 이용 신청을 하는 것을 말합니다.</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">제3조 (약관의 효력 및 변경)</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-700">
              <li>본 약관은 서비스를 이용하고자 하는 모든 회원에게 그 효력이 발생합니다.</li>
              <li>회사는 필요한 경우 관련 법령을 위배하지 않는 범위 내에서 본 약관을 변경할 수 있습니다.</li>
              <li>약관이 변경되는 경우 회사는 변경사항을 시행일자 7일 전부터 회원에게 공지합니다.</li>
              <li>회원이 변경된 약관에 동의하지 않는 경우 서비스 이용을 중단하고 탈퇴할 수 있습니다.</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">제4조 (회원가입)</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-700">
              <li>회원가입은 이용자가 본 약관의 내용에 동의한 후 회사가 정한 양식에 따라 회원정보를 기입하고, 
                  회사가 이를 승인함으로써 성립됩니다.</li>
              <li>회사는 다음 각 호에 해당하는 경우 회원가입을 거부할 수 있습니다:
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>실명이 아니거나 타인의 명의를 사용한 경우</li>
                  <li>허위 정보를 기재한 경우</li>
                  <li>사회의 안녕질서 또는 미풍양속을 저해할 목적으로 신청한 경우</li>
                  <li>기타 회사가 정한 이용신청 요건이 미비한 경우</li>
                </ul>
              </li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">제5조 (서비스의 제공)</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-700">
              <li>회사는 다음과 같은 서비스를 제공합니다:
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>숙박시설 정보 제공 및 예약 중개</li>
                  <li>예약 내역 조회 및 관리</li>
                  <li>포인트 및 쿠폰 관리</li>
                  <li>고객 리뷰 작성 및 조회</li>
                  <li>기타 회사가 정하는 서비스</li>
                </ul>
              </li>
              <li>서비스는 연중무휴 1일 24시간 제공함을 원칙으로 합니다.</li>
              <li>회사는 시스템 점검, 보수 등의 사유로 서비스 제공을 일시적으로 중단할 수 있습니다.</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">제6조 (예약 및 결제)</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-700">
              <li>회원은 사이트에서 제공하는 절차에 따라 예약을 신청할 수 있습니다.</li>
              <li>예약이 완료되면 회원이 등록한 이메일로 예약 확인서가 발송됩니다.</li>
              <li>결제는 신용카드, 체크카드, 가상계좌 등 회사가 제공하는 결제수단을 통해 이루어집니다.</li>
              <li>회원은 예약 시 입력한 정보에 대해 책임을 지며, 잘못된 정보로 인한 불이익은 회원이 부담합니다.</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">제7조 (예약 취소 및 환불)</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-700">
              <li>체크인 24시간 전까지는 무료 취소가 가능하며, 결제 금액 전액이 환불됩니다.</li>
              <li>체크인 24시간 이내 취소 시에는 숙박시설의 취소 정책에 따라 위약금이 부과될 수 있습니다.</li>
              <li>환불은 결제 수단에 따라 3-7 영업일이 소요될 수 있습니다.</li>
              <li>천재지변, 감염병 확산 등 불가항력적인 사유로 인한 취소는 별도의 정책이 적용될 수 있습니다.</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">제8조 (회원의 의무)</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-700">
              <li>회원은 본 약관 및 관계 법령을 준수하여야 합니다.</li>
              <li>회원은 다음 행위를 하여서는 안 됩니다:
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>허위 정보 입력</li>
                  <li>타인의 정보 도용</li>
                  <li>회사의 서비스 운영을 방해하는 행위</li>
                  <li>회사의 지적재산권을 침해하는 행위</li>
                  <li>기타 관계 법령에 위배되는 행위</li>
                </ul>
              </li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">제9조 (회사의 의무)</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-700">
              <li>회사는 관계 법령과 본 약관이 금지하는 행위를 하지 않으며, 
                  지속적이고 안정적인 서비스 제공을 위해 최선을 다합니다.</li>
              <li>회사는 회원의 개인정보 보호를 위해 보안시스템을 구축하고 개인정보처리방침을 공시하고 준수합니다.</li>
              <li>회사는 서비스 이용과 관련하여 회원으로부터 제기된 의견이나 불만이 정당하다고 인정되는 경우 
                  이를 처리하여야 합니다.</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">제10조 (면책조항)</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-700">
              <li>회사는 천재지변, 전쟁, 기간통신사업자의 서비스 중지 등 불가항력으로 인해 
                  서비스를 제공할 수 없는 경우 책임이 면제됩니다.</li>
              <li>회사는 회원의 귀책사유로 인한 서비스 이용 장애에 대하여 책임을 지지 않습니다.</li>
              <li>회사는 회원이 서비스를 이용하여 기대하는 수익을 얻지 못하거나 상실한 것에 대하여 책임을 지지 않습니다.</li>
              <li>회사는 숙박시설이 제공하는 서비스의 내용, 품질 등에 대해서는 책임을 지지 않습니다.</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">제11조 (분쟁 해결)</h2>
            <p className="text-gray-700 leading-relaxed">
              본 약관과 관련하여 분쟁이 발생한 경우 회사와 회원은 성실히 협의하여 해결하도록 노력합니다. 
              협의가 이루어지지 않을 경우 민사소송법상의 관할법원에 소를 제기할 수 있습니다.
            </p>
          </section>

          <section className="mb-8 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">부칙</h2>
            <p className="text-gray-700">
              본 약관은 2025년 1월 1일부터 시행됩니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
