// Copyright (C) 2021 Intel Corporation
//
// SPDX-License-Identifier: MIT

import { delay, times } from 'lodash';
import { ActionUnion, createAction, ThunkAction } from 'utils/redux';

import config from '../../../cvat-core/src/config';

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
    openExportModalOnce: (instance: any) => createAction(ExportActionTypes.OPEN_EXPORT_ONCE_MODAL, { instance }),
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

// export const testExportDatasetAsync = (
// ): ThunkAction => async () => {
//     try {
//         const taskID = window.localStorage.getItem('taskID')?.split(',');
//         if (typeof taskID !== 'undefined') {
//             for (let i = 0; i < 10; i++) {
//                 // eslint-disable-next-line max-len
//                 const test = window.localStorage.getItem(`${taskID[i]}test`)?.split('_');
//                 if (typeof test !== 'undefined') {
//                     const real = [test[0], test[2], test[4]];
//                     const filename = real.join('_');
//                     let url;
//                     if (test[1] === 'CASE2') {
//                         // eslint-disable-next-line max-len
//                         url = `http://localhost:3000/api/v1/tasks/${taskID[i]}/annotations?format=COCO%201.0&filename=${filename}&action=download`;
//                     } else {
//                         // eslint-disable-next-line max-len
//                         url = `http://localhost:3000/api/v1/tasks/${taskID[i]}/annotations?format=Datumaro%201.0&filename=${filename}&action=download`;
//                     }
//                     console.log(url);
//                     const downloadAnchor = window.document.getElementById('downloadAnchor') as HTMLAnchorElement;
//                     downloadAnchor.href = url;
//                     downloadAnchor.click();
//                     localStorage.removeItem(`${taskID[i]}test`);
//                 }
//             }
//         }
//     } catch (error) {
//         console.log('testExportDatasetAsync >>>> 6');
//         console.log(error);
//     }
// };


export const testExportDatasetAsync = (
): ThunkAction => async () => {
    try {
        const taskID = window.localStorage.getItem('taskID')?.split(',');
        if (typeof taskID !== 'undefined') {
            for (let i = 0; i < 10; i++) {
                // eslint-disable-next-line max-len
                const test = window.localStorage.getItem(`${taskID[i]}test`)?.split('_');
                if (typeof test !== 'undefined') {
                    const real = [test[0], test[2], test[4]];
                    const filename = real.join('_');
                    let url:string;
                    if (test[1] === 'CASE2') {
                        // eslint-disable-next-line max-len
                        url = `http://localhost:3000/api/v1/tasks/${taskID[i]}/annotations?format=COCO%201.0&filename=${filename}`;
                    } else {
                        // eslint-disable-next-line max-len
                        url = `http://localhost:3000/api/v1/tasks/${taskID[i]}/annotations?format=Datumaro%201.0&filename=${filename}`;
                    }
                    Axios.get(`${url}`, {
                        proxy: config.proxy,
                    });
                    // downloadAnchor.click();
                    localStorage.removeItem(`${taskID[i]}test`);
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
        console.log('testExportDatasetAsync >>>> 6');
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
