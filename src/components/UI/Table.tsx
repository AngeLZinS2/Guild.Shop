import React from 'react';

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export const Table = ({ children, className = '' }: TableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full divide-y divide-gray-700 ${className}`}>
        {children}
      </table>
    </div>
  );
};

interface TableHeadProps {
  children: React.ReactNode;
  className?: string;
}

export const TableHead = ({ children, className = '' }: TableHeadProps) => {
  return (
    <thead className={`bg-gray-700 ${className}`}>
      {children}
    </thead>
  );
};

interface TableBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const TableBody = ({ children, className = '' }: TableBodyProps) => {
  return (
    <tbody className={`bg-gray-800 divide-y divide-gray-700 ${className}`}>
      {children}
    </tbody>
  );
};

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const TableRow = ({ children, className = '', onClick }: TableRowProps) => {
  return (
    <tr 
      className={`${onClick ? 'cursor-pointer hover:bg-gray-700' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </tr>
  );
};

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
}

export const TableCell = ({ children, className = '' }: TableCellProps) => {
  return (
    <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-300 ${className}`}>
      {children}
    </td>
  );
};

interface TableHeaderCellProps {
  children: React.ReactNode;
  className?: string;
}

export const TableHeaderCell = ({ children, className = '' }: TableHeaderCellProps) => {
  return (
    <th 
      scope="col"
      className={`px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider ${className}`}
    >
      {children}
    </th>
  );
};