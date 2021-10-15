// Copyright (C) 2021 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import { connect } from 'react-redux';

import { TasksState, TasksQuery, CombinedState } from 'reducers/interfaces';

// import ExportDataset from 'components/export-dataset/export-dataset-modal';

import TasksListComponent from 'components/tasks-page/task-list';

import { getTasksAsync } from 'actions/tasks-actions';
import TaskListComponent from 'components/tasks-page/task-list';
import taskItem from 'components/tasks-page/task-item';
import ExportDatasetModal from 'components/export-dataset/export-dataset-modal';

interface StateToProps {
    tasks: TasksState;
}

interface DispatchToProps {
    getTasks: (query: TasksQuery) => void;
}

interface OwnProps {
    onSwitchPage: (page: number) => void;
}

function mapStateToProps(state: CombinedState): StateToProps {
    return {
        tasks: state.tasks,
    };
}

function mapDispatchToProps(dispatch: any): DispatchToProps {
    return {
        getTasks: (query: TasksQuery): void => {
            dispatch(getTasksAsync(query));
        },
    };
}

type TasksListContainerProps = StateToProps & DispatchToProps & OwnProps;

function TasksListContainer(props: TasksListContainerProps): JSX.Element {
    const { tasks, onSwitchPage } = props;

    /*
        author: minguin
        Date : 2021.10.14
        Comment : Task를 리스트 형식으로 가져와 각각의 테스크 선택하는 방법
        (#55) JSON.stringify(JSON.parse(JSON.stringify(tasks.current))[0])
    */

    const testArray:any[] = [];

    for (let i = 0; i < 10; i++) {
        testArray.push(JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(tasks.current))[i])));
    }

    return (
        <>
            <TasksListComponent
                onSwitchPage={onSwitchPage}
                currentTasksIndexes={tasks.current.map((task): number => task.instance.id)}
                currentPage={tasks.gettingQuery.page}
                numberOfTasks={tasks.count}
            />
            <ExportDatasetModal task={testArray} />

        </>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(TasksListContainer);
