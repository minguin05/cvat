// Copyright (C) 2021 Intel Corporation
//
// SPDX-License-Identifier: MIT

import './styles.scss';
import React, { useState } from 'react';
import Modal from 'antd/lib/modal';
import Button from 'antd/lib/button';
import { DownloadOutlined, LoadingOutlined } from '@ant-design/icons';
import Text from 'antd/lib/typography/Text';
import Select from 'antd/lib/select';
import Checkbox from 'antd/lib/checkbox';
import Input from 'antd/lib/input';
import Form from 'antd/lib/form';

/*
    author : minguin
    date : 2021.10.07
    comments : task 클릭 후 export 시 출력되는 모달창
*/

export interface ExportProps {
    task : any[];
    tasksnum : any;
    dataName : any;
    taskInstace : any;
}

function ExportDatasetModal(props: ExportProps): JSX.Element {
    const { task, tasksnum, taskInstace } = props;
    const testArray:any[] = [];

    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    // console.log(`testArrayOnce >>> ${JSON.stringify(testArray[0].instance)}`);


    if (typeof task !== 'undefined') {
        for (let i = 0; i < tasksnum; i++) {
            // testArray.push((JSON.parse(JSON.stringify(task))[i]));
            testArray.push(task[i].instance);
        }
    }

    console.log(`testArrayOnce >>> ${JSON.stringify(testArray[0])}`);
    console.log(`testArrayOnce Length >>> ${testArray.length}`);
    console.log(`taskInstace >>> ${taskInstace}`);

    // const listItem = testArray.map((instance) =>
    //     <li>{JSON.stringify(instance)}</li>);

    return (
        <>
            <Button type='primary' onClick={showModal}>
                Open Modal
            </Button>
            <Modal title='Basic Modal' visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Modal>
        </>
    );
}
export default React.memo(ExportDatasetModal);