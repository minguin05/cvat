// Copyright (C) 2020-2021 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import { Row, Col } from 'antd/lib/grid';
import Pagination from 'antd/lib/pagination';

import ModelRunnerModal from 'components/model-runner-modal/model-runner-dialog';
import MoveTaskModal from 'components/move-task-modal/move-task-modal';
import TaskItem from 'containers/tasks-page/task-item';

/*
    author : minguin
    date : 2021.10.07
    comments : 검색 결과의 taskID 추출
    ADD source :
    for (let i = 0; i < numberOfTasks; i++) {
        console.log(taskViews[i].props.taskID);
    }
*/

export interface ContentListProps {
    onSwitchPage(page: number): void;
    currentTasksIndexes: number[];
    currentPage: number;
    numberOfTasks: number;
}

export default function TaskListComponent(props: ContentListProps): JSX.Element {
    const {
        currentTasksIndexes, numberOfTasks, currentPage, onSwitchPage,
    } = props;

    const taskViews = currentTasksIndexes.map((tid, id): JSX.Element => <TaskItem idx={id} taskID={tid} key={tid} />);
    // taskViews의 결과 중 taskID만 추출하여 호출
    // for (let i = 0; i < numberOfTasks; i++) {
    //     console.log(`taskInstance>>>${testId}`);
    // }

    return (
        <>
            <Row justify='center' align='middle'>
                <Col className='cvat-tasks-list' md={22} lg={18} xl={16} xxl={14}>
                    {taskViews}
                </Col>
            </Row>
            <Row justify='center' align='middle'>
                <Col md={22} lg={18} xl={16} xxl={14}>
                    <Pagination
                        className='cvat-tasks-pagination'
                        onChange={onSwitchPage}
                        showSizeChanger={false}
                        total={numberOfTasks}
                        pageSize={10}
                        current={currentPage}
                        showQuickJumper
                    />
                </Col>
            </Row>
            <ModelRunnerModal />
            <MoveTaskModal />
        </>
    );
}
