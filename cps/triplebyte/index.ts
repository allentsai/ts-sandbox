import * as readline from 'readline';

class TicTacToeBoard {
    board: any;
    constructor() {
        this.board = Array(3);
        for (let i = 0; i < 3; i++) {
            this.board[i] = Array(3).fill('-');
        }
    }

    private isInvalidMove(row, column) {
        return row >=3 || column >=3 
        || row === undefined 
        || column === undefined 
        || row < 0
        || column < 0
        || !Number.isInteger(row)
        ||!Number.isInteger(column)
        || this.board[row][column] !== '-';
    }

    public makeUserMove(row, column) {
        if (this.isInvalidMove(row, column)) {
            return false;
        }
        this.makeMove(row, column, 'X');
        return true;
    }

    public makeMove(row, column, character) {
        this.board[row][column] = character;
    }

    public print() {
        for(let i = 0; i < this.board.length; i++) {
            console.log(this.board[i].join('|'));
        }
    }

    public isBoardFull() {
        for (let i = 0; i < this.board.length; i++) {
            let row = this.board[i];
            
            if (row.includes('-')) {
                return false;
            }
        }
        return true;
    }

    public aiMove() {
        if (this.isBoardFull()) {
            throw new Error('AI cannot make a move, the board is full.');
        }

        for (let i = 0; i < this.board.length; i++) {
            let row = this.board[i];
            for (let j = 0; j < row.length; j++) {
                if (row[j] == '-') {
                    this.makeMove(i, j, 'O');
                    return;
                }
            }
        }
    }
}
// step 1
// const board = new TicTacToeBoard();
// board.print();
// board.makeMove(0,1,'X');
// board.print();

// //step 2
// board.aiMove();
// board.aiMove();
// board.aiMove();
// board.aiMove();
// board.aiMove();
// board.aiMove();
// board.aiMove();
// board.aiMove();
// board.aiMove();
// board.print();

// step 3
const read = readline.createInterface(process.stdin, process.stdout);
const board = new TicTacToeBoard();
read.on('line', (line) => {
    const inputArray = line.split(' ');
    let moveResult = true;

    if (inputArray.length > 2) {
        moveResult = false;
    } else {
        const [row, column] = inputArray;
        if (row)
        moveResult = board.makeUserMove(parseInt(row), parseInt(column));
    }
    
    if (board.isBoardFull()) {
        console.log('Game finished');
        read.close();
    } else if (moveResult) {
        board.print();
        console.log('Ai moving...');
        board.aiMove();
        board.print();
    } else {
        console.log('That move was not legal, please try again');
    }
}).on('close', ()=> {
    process.exit();
});
