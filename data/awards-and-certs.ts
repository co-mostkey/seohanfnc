export interface AwardOrCertItem {
  id: string; // Unique identifier (e.g., year-month-index or specific code)
  type: 'award' | 'certification' | 'patent' | 'selection'; // Type classification
  year: string;
  month?: string; // Optional month
  title: string; // Main title or name
  description?: string; // Additional description or details
  issuer?: string; // Issuing organization or body
  imageSrc?: string; // Path to the image (placeholder if not available)
  // Add other relevant fields if needed
}

// Combined and structured data based on previous mock data and history
// TODO: Verify accuracy, add actual image paths, and complete data
export const awardsAndCertsData: AwardOrCertItem[] = [
  // 2018
  {
    id: '2018-09-kdbtech',
    type: 'selection' as const,
    year: '2018',
    month: '09',
    title: '[KDB-TECH] 기업 선정',
    description: '4차 산업 유망기업',
    issuer: '한국산업은행',
    imageSrc: '/images/certs/kdb-tech.jpg'
  },
  {
    id: '2018-01-iso9001',
    type: 'certification' as const,
    year: '2018',
    month: '01',
    title: 'ISO 9001:2015 인증 획득',
    description: '품질경영시스템 (Q209412)',
    issuer: 'ISO (인증기관명 필요)',
    imageSrc: '/images/certs/iso9001.jpg'
  },
  // ... (Patents from CertPatentBox for 2018)
  { id: '2018-patent-1828191', type: 'patent' as const, year: '2018', title: '특허증', description: '특허 번호 10-1828191', imageSrc: '/imgsign/m_3_4_img8.jpg' },
  { id: '2018-patent-1834722', type: 'patent' as const, year: '2018', title: '특허증', description: '특허 번호 10-1834722', imageSrc: '/imgsign/m_3_4_img9.jpg' },
  { id: '2018-patent-1876352', type: 'patent' as const, year: '2018', title: '특허증', description: '특허 번호 10-1876352', imageSrc: '/imgsign/m_3_4_img10.jpg' },
  { id: '2018-patent-1890591', type: 'patent' as const, year: '2018', title: '특허증', description: '특허 번호 10-1890591', imageSrc: '/imgsign/m_3_4_img11.jpg' },
  { id: '2018-patent-1911968', type: 'patent' as const, year: '2018', title: '특허증', description: '특허 번호 10-1911968', imageSrc: '/imgsign/m_3_4_img12.jpg' },

  // 2017
  {
    id: '2017-10-chungbuk',
    type: 'award' as const,
    year: '2017',
    month: '10',
    title: '충청북도 중소기업 경영대상 수상',
    description: '충청북도 도지사상',
    issuer: '충청북도',
    imageSrc: '/images/awards/chungbuk-award.jpg'
  },
  {
    id: '2017-03-kfi-descender',
    type: 'certification' as const,
    year: '2017',
    month: '03',
    title: '완강기/간이완강기 형식승인',
    description: '신규 형식승인 취득',
    issuer: 'KFI (한국소방산업기술원)',
    imageSrc: '/images/certs/kfi-descender.jpg'
  },
  {
    id: '2017-03-kfi-mat',
    type: 'certification' as const,
    year: '2017',
    month: '03',
    title: '인명구조매트 KFI 인증',
    description: '초동대처 기동형',
    issuer: 'KFI (한국소방산업기술원)',
    imageSrc: '/images/certs/kfi-mat.jpg'
  },
  { id: '2017-patent-1782572', type: 'patent' as const, year: '2017', title: '특허증', description: '특허 번호 10-1782572', imageSrc: '/imgsign/m_3_4_img7.jpg' },

  // 2016
  { id: '2016-design-0870287', type: 'patent' as const, year: '2016', title: '디자인등록증', description: '디자인 등록번호 30-0870287', imageSrc: '/imgsign/m_3_4_img4.jpg' },
  // ... Add other 2016 events if relevant (성실납세자, 산학협력, 연구소기업 설립)

  // 2015
  {
    id: '2015-12-family',
    type: 'certification' as const,
    year: '2015',
    month: '12',
    title: '가족친화 인증기업 인증',
    issuer: '여성가족부',
    imageSrc: '/images/certs/family-friendly.jpg'
  },
  {
    id: '2015-03-export',
    type: 'selection' as const,
    year: '2015',
    month: '03',
    title: '수출 유망 중소기업 선정',
    issuer: '중소기업청',
    imageSrc: '/images/certs/export-promising.jpg'
  },
  { id: '2015-patent-1566116', type: 'patent' as const, year: '2015', title: '특허증', description: '특허 번호 10-1566116', imageSrc: '/imgsign/m_3_4_img6.jpg' },

  // 2014
  { id: '2014-patent-1463026', type: 'patent' as const, year: '2014', title: '특허증', description: '특허 번호 10-1463026', imageSrc: '/imgsign/m_3_4_img5.jpg' },
  // ... Add other 2014 events if relevant (강소기업 선정, 특허 4건 등록 상세)

  // 2013
  { id: '2013-08-kfi-descender-new', type: 'certification' as const, year: '2013', month: '08', title: '신형 완강기 KFI 형식인증', description: '특허기술 활용 기능 강화', issuer: 'KFI', imageSrc: '/images/certs/kfi-new-descender.jpg' },

  // 2012
  // ... (연구소 설립)

  // 2011
  {
    id: '2011-10-safetyaward',
    type: 'award' as const,
    year: '2011',
    month: '10',
    title: '대한민국 안전대상 수상',
    description: '우수제품상',
    issuer: '소방방재청',
    imageSrc: '/images/awards/korea-safety-award.jpg'
  },
  {
    id: '2011-10-innobiz',
    type: 'certification' as const,
    year: '2011',
    month: '10',
    title: '이노비즈(Inno-Biz) 기업 선정',
    description: '기술혁신형 중소기업',
    issuer: '중소기업청',
    imageSrc: '/images/certs/innobiz.jpg'
  },

  // 2010
  { id: '2010-11-china-cert', type: 'certification' as const, year: '2010', month: '11', title: '중국 국가소방장구 제품인증', description: '공기안전매트, 구조대', issuer: '중국 국가소방장구 질량중심', imageSrc: '/images/certs/china-ccc.jpg' },
  // ... (유망중소기업)

  // 2009
  {
    id: '2009-06-nema',
    type: 'award' as const,
    year: '2009',
    month: '06',
    title: '소방산업 육성 기여 공로상',
    description: '소방방재청장상',
    issuer: '소방방재청',
    imageSrc: '/images/awards/nema-award.jpg'
  },
  // ... (중국법인)

  // 2008
  // ... (수출)

  // 2007
  { id: '2007-11-mainbiz', type: 'certification' as const, year: '2007', month: '11', title: '경영혁신형 중소기업(Main-Biz) 선정', issuer: '중소기업청', imageSrc: '/images/certs/management-innovation.jpg' },
  { id: '2007-05-patent-airmat', type: 'patent' as const, year: '2007', month: '05', title: '공기주입식 인명구조막 특허 취득', imageSrc: '/images/certs/patent-airmat.jpg' },

  // 2006
  { id: '2006-02-kfi-support', type: 'certification' as const, year: '2006', month: '02', title: '완강기 설치대 KFI 인증', issuer: 'KFI', imageSrc: '/images/certs/kfi-support.jpg' },

  // 2005
  // ... (합작법인, 수출)

  // 2004
  { id: '2004-11-iso9001', type: 'certification' as const, year: '2004', month: '11', title: 'ISO 9001 인증 획득', description: '품질경영시스템', issuer: 'ISO (인증기관명 필요)', imageSrc: '/images/certs/iso9001-initial.jpg' },
  { id: '2004-02-china-cert-descender', type: 'certification' as const, year: '2004', month: '02', title: '중국 완강기 품질인증', issuer: '중국 국가소방장구질량감찰검사중심', imageSrc: '/images/certs/china-descender-cert.jpg' },

  // 2003
  // ... (수출)

  // 2002
  { id: '2002-10-kfi-initial', type: 'certification' as const, year: '2002', month: '10', title: '완강기/간이완강기/구조대 형식승인', issuer: 'KFI', imageSrc: '/images/certs/kfi-initial.jpg' },

  // ... (Add older data if needed)
].sort((a, b) => parseInt(b.year) - parseInt(a.year) || parseInt(b.month || '0') - parseInt(a.month || '0')); // Sort by year then month descending 