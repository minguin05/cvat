// Copyright (C) 2021 Intel Corporation
//
// SPDX-License-Identifier: MIT

import './styles.scss';
import React, { useCallback, useEffect, useState } from 'react';
import Modal from 'antd/lib/modal';
import Button from 'antd/lib/button';
import DownloadOutlined from '@ant-design/icons';
import Notification from 'antd/lib/notification';
import { useDispatch } from 'react-redux';
import { matches } from 'lodash';
import { testExportDatasetAsync } from 'actions/export-actions';

/*
    author : minguin
    date : 2021.10.07
    comments : task 클릭 후 export 시 출력되는 모달창
*/

function ExportDatasetModalOnce(): JSX.Element {
    const testArray:any[] = [];
    const dispatch = useDispatch();

    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleExport = useCallback(
        (): void => {
            dispatch(
                testExportDatasetAsync(),
            );
            Notification.info({
                message: 'Dataset export started',
                description:
                    'Download will start automaticly as soon as the dataset is ready.',
                className: 'cvat-notification-notice-export-task-start',
            });
        },
        [],
    );

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    let button = null;
    if (window.sessionStorage.getItem('userName') === 'kimsu') {
        button = (
            <Button
                    size='large'
                    type='primary'
            icon={<DownloadOutlined />}
            onClick={showModal}
            >
    Export Once
            </Button>
);
    }

    // console.log(`testArrayOnce >>> ${JSON.stringify(testArray[0].instance)}`);
    const taskID = window.localStorage.getItem('taskID')?.split(',');

    if (typeof taskID !== 'undefined') {
        for (let i = 0; i < taskID.length; i++) {
            testArray.push(window.localStorage.getItem(`${taskID[i]}test`));
        }
    }
    const listItem = testArray.map((instance) =>
        <li>{JSON.stringify(instance)}</li>);

    return (
        <>
            {button}
            <Modal title='Basic Modal' visible={isModalVisible} onOk={handleExport} onCancel={handleCancel}>
                <b>
                    {' '}
                    Total Num:
                    {taskID?.length}
                    {' '}
                </b>
                <p>{listItem}</p>
            </Modal>
        </>
    );
}
export default React.memo(ExportDatasetModalOnce);
