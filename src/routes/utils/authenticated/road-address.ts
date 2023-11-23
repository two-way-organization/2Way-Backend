import type { ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';
import type { JwtPayloadState } from '../../@types/jwt-payload-state';

const ADDRESS_API_URL = 'https://business.juso.go.kr/addrlink/addrLinkApi.do';

export interface AddressRequestBody {
  /**
   * 검색어
   */
  keyword: string;
  /**
   * 현재 페이지 번호
   */
  currentPage: number;
  /**
   * 페이지당 출력할 결과 Row 수
   */
  countPerPage: number;
}

export interface AddressResponseBody {
  common: {
    /**
     * 총 검색 결과 수
     */
    totalCount: string;
    /**
     * 현재 페이지 번호
     */
    currentPage: number;
    /**
     * 페이지당 출력할 결과 Row 수
     */
    countPerPage: number;
    /**
     * 에러 코드
     */
    errorCode: string;
    /**
     * 에러 메시지
     */
    errorMessage: string;
  };
  juso: {
    /**
     * 도로명 주소
     */
    roadAddr: string;
    /**
     * 도로명주소(참고항목 제외)
     */
    roadAddrPart1: string;
    /**
     * 도로명주소(참고항목)
     */
    roadAddrPart2?: string;
    /**
     * 지번 주소
     */
    jibunAddr: string;
    /**
     * 영문 도로명 주소
     */
    engAddr: string;
    /**
     * 우편번호
     */
    zipNo: string;
    /**
     * 행정구역코드
     */
    admCd: string;
    /**
     * 도로명 코드
     */
    rnMgtSn: string;
    /**
     * 건물관리번호
     */
    bdMgtSn: string;
    /**
     * 상세 건물명
     */
    detBdNmList?: string;
    /**
     * 건물명
     */
    bdNm?: string;
    /**
     * 공동주택 여부
     * @example
     * 1: 공동주택
     * 0: 비공동주택
     */
    bdKdcd: string;
    /**
     * 시, 도 명
     */
    siNm: string;
    /**
     * 시, 군, 구 명
     */
    sggNm: string;
    /**
     * 읍, 면, 동 명
     */
    emdNm: string;
    /**
     * 법정리 명
     */
    liNm?: string;
    /**
     * 도로명
     */
    rn: string;
    /**
     * 지하여부
     * @example
     * 0: 지상
     * 1: 지하
     */
    udrtYn: string;
    /**
     * 건물본번
     */
    buldMnnm: number;
    /**
     * 건물부번
     */
    buldSlno: number;
    /**
     * 산 여부
     * @example
     * 0: 대지
     * 1: 산
     */
    mtYn: string;
    /**
     * 지번본번(번지)
     */
    lnbrMnnm: number;
    /**
     * 지번부번(호)
     */
    lnbrSlno: number;
    /**
     * 읍면동일련번호
     */
    emdNo: string;
    /**
     * 변동이력 여부
     * @example
     * 0: 현행 주소정보
     * 1: 요청변수의 keyword(검색어)가 변동된, 주소정보에서 검색된 정보
     */
    hstryYn: string;
    /**
     * 관련 지번
     */
    relJibun?: string;
    /**
     * 관할 주민센터
     */
    hemdNm?: string;
  };
}


export const roadAddress = async (
  ctx: ParameterizedContext<JwtPayloadState, ZodContext<unknown, unknown, unknown, AddressRequestBody, unknown>, AddressResponseBody>,
) => {
  const { keyword, currentPage, countPerPage } = ctx.request.body;

  const response = await fetch(ADDRESS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      confmKey: process.env.ROAD_ADDRESS_API_KEY!,
      currentPage: String(currentPage),
      countPerPage: String(countPerPage),
      keyword,
      resultType: 'json',
      firstSort: 'road',
    }),
  });

  ctx.status = 200;
  ctx.body = (await response.json()) as AddressResponseBody;
};
