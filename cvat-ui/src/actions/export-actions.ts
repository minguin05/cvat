// Copyright (C) 2021 Intel Corporation
//
// SPDX-License-Identifier: MIT

import { delay, times } from 'lodash';
import { ActionUnion, createAction, ThunkAction } from 'utils/redux';

import config from '../../../cvat-core/src/config';

/*
    Author : minguin
    Date : 2021.10.26
    Comment : 버튼 클릭 시 일괄 다운로드하는 기능 추가
*/

export enum ExportActionTypes {
    OPEN_EXPORT_MODAL = 'OPEN_EXPORT_MODAL',
    OPEN_EXPORT_ONCE_MODAL = 'OPEN_EXPORT_ONCE_MODAL',
    CLOSE_EXPORT_MODAL = 'CLOSE_EXPORT_MODAL',
    EXPORT_DATASET = 'EXPORT_DATASET',
    EXPORT_DATASET_SUCCESS = 'EXPORT_DATASET_SUCCESS',
    EXPORT_DATASET_FAILED = 'EXPORT_DATASET_FAILED',
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Axios = require('axios');

export const exportActions = {
    openExportModal: (instance: any) => createAction(ExportActionTypes.OPEN_EXPORT_MODAL, { instance }),
    closeExportModal: () => createAction(ExportActionTypes.CLOSE_EXPORT_MODAL),
    exportDataset: (instance: any, format: string) =>
        createAction(ExportActionTypes.EXPORT_DATASET, { instance, format }),
    exportDatasetSuccess: (instance: any, format: string) =>
        createAction(ExportActionTypes.EXPORT_DATASET_SUCCESS, { instance, format }),
    exportDatasetFailed: (instance: any, format: string, error: any) =>
        createAction(ExportActionTypes.EXPORT_DATASET_FAILED, {
            instance,
            format,
            error,
        }),
};


// 클릭 시 실행되는 함수
export const ExportOnceDatasetAsync = (
): ThunkAction => async () => {
    try {
        const taskID = window.localStorage.getItem('taskID')?.split(',');
        // 로컬 스토리지에 저장되어 있는 값의 타입이 undefined가 아닐 경우에만 실행
        if (typeof taskID !== 'undefined') {
            for (let i = 0; i < taskID.length; i++) {
                // eslint-disable-next-line max-len
                
                // 스토리지에 저장되어 있는 item name 저장 후 type이 undefined 체크
                const test = window.localStorage.getItem(`${taskID[i]}_item`)?.split('_');
                if (typeof test !== 'undefined') {
                    // 이름에서 필요한 부분을 분리하여 생성
                    const real = [test[0], test[2], test[4]];
                    const filename = real.join('_');
                    // API를 호출할 url 생성
                    let url:string;
                    if (test[1] === 'CASE2') {
                        // COCO 1.0 형태로 다운로드 받아야하는 경우
                        // eslint-disable-next-line max-len
                        url = `http://localhost:3000/api/v1/tasks/${taskID[i]}/annotations?format=COCO%201.0&filename=${filename}`;
                    } else {
                        // Datumaro 1.0 형태로 다운로드 받아야하는 겨웅
                        // eslint-disable-next-line max-len
                        url = `http://localhost:3000/api/v1/tasks/${taskID[i]}/annotations?format=Datumaro%201.0&filename=${filename}`;
                    }
                    Axios.get(`${url}`, {
                        proxy: config.proxy,
                    });
                    // 스토리지에 저장되어있던 item 삭제
                    localStorage.removeItem(`${taskID[i]}_item`);
                    // 3초에 한번 실행되도록 설정
                    setTimeout(() => {
                        const downloadAnchor = window.document.getElementById('downloadAnchor') as HTMLAnchorElement;
                        url = `${url}&action=download`;
                        downloadAnchor.href = url;
                        downloadAnchor.click();
                        console.log(`downloadAnchor.href = url >>>>> ${url}`);
                    }, i * 3000);
                }
            }
        }
    } catch (error) {
        console.log('ExportOnceDatasetAsync >>>> 6');
        console.log(error);
    }
};

export const exportDatasetAsync = (
    instance: any,
    format: string,
    name: string,
    saveImages: boolean,
): ThunkAction => async (dispatch) => {
    // dispatch(exportActions.exportDataset(instance, format));
    try {
        const url = await instance.annotations.exportDataset(format, saveImages, name);
        const downloadAnchor = window.document.getElementById('downloadAnchor') as HTMLAnchorElement;
        downloadAnchor.href = url;
        downloadAnchor.click();
        // dispatch(exportActions.exportDatasetSuccess(instance, format));
    } catch (error) {
        dispatch(exportActions.exportDatasetFailed(instance, format, error));
    }
};

// minguin
export const exportDatasetOneAsync = (
    instance: any,
    format: string,
    name: string,
    saveImages: boolean,
): ThunkAction => async (dispatch) => {
    dispatch(exportActions.exportDataset(instance, format));

    try {
        const url = await instance.annotations.exportDataset(format, saveImages, name);
        const downloadAnchor = window.document.getElementById('downloadAnchor') as HTMLAnchorElement;
        downloadAnchor.href = url;
        downloadAnchor.click();
        dispatch(exportActions.exportDatasetSuccess(instance, format));
    } catch (error) {
        dispatch(exportActions.exportDatasetFailed(instance, format, error));
    }
};

export type ExportActions = ActionUnion<typeof exportActions>;
