import { prismaClient } from '../../../utils/prisma-client';
import type { ParameterizedContext } from 'koa';
import { JobLocation } from '@prisma/client';

// 사용자 입력을 JobLocation 열거형으로 매핑하는 함수
function mapToJobLocation(location: string): JobLocation | undefined {
    switch (location) {
        case '서울': return JobLocation.Seoul;
        case '경기': return JobLocation.Gyeonggi;
        case '인천': return JobLocation.Incheon;
        case '대전': return JobLocation.Daejeon;
        case '세종': return JobLocation.Sejong;
        case '충남': return JobLocation.Chungnam;
        case '충북': return JobLocation.Chungbuk;
        case '광주': return JobLocation.Gwangju;
        case '전남': return JobLocation.Jeonnam;
        case '전북': return JobLocation.Jeonbuk;
        case '대구': return JobLocation.Daegu;
        case '경북': return JobLocation.Gyeongbuk;
        case '부산': return JobLocation.Busan;
        case '울산': return JobLocation.Ulsan;
        case '경남': return JobLocation.Gyeongnam;
        case '강원': return JobLocation.Gangwon;
        case '제주': return JobLocation.Jeju;
        default: return undefined;
    }
}

export async function searchJobsByLocations(ctx: ParameterizedContext) {
    try {
        // 사용자 입력을 JobLocation 타입으로 변환
        const locations = (ctx.query.locations as string[])
            .map(mapToJobLocation)
            .filter((location): location is JobLocation => location !== undefined);

        const jobs = await prismaClient.job.findMany({
            where: {
                location: {
                    in: locations
                }   
            },
            select: {
                location: true,
            }
        });

        ctx.body = {
            message: 'Success',
            data: jobs
          };
    } catch (error) {
        console.error('Error during database query:', error);
        ctx.status = 500;
        ctx.body = { message: 'Internal server error' };
    }
}