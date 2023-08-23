/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { InputField, Link } from '$app/components/forms';
import { Table, Tbody, Td, Th, Thead, Tr } from '$app/components/tables';
import { atom, useAtom } from 'jotai';
import { cloneDeep } from 'lodash';
import { useEffect, useState } from 'react';
import { BiSortAlt2 } from 'react-icons/bi';

export const previewAtom = atom<Preview | null>(null);

export interface PreviewResponse {
  columns: Column[];
  [key: number]: Cell[];
}

export interface Preview {
  columns: Column[];
  rows: Cell[][];
}

export interface Column {
  identifier: string;
  display_value: string;
}

export interface Cell {
  entity: string;
  id: string;
  hashed_id: null;
  value: string;
  display_value: string | JSX.Element | number;
  identifier: string;
}

interface Replacement {
  identifier: string;
  format: (cell: Cell) => string | number | JSX.Element;
}

export function usePreview() {
  const [preview] = useAtom(previewAtom);
  const [processed, setProcessed] = useState<Preview | null>(null);

  const replacements: Replacement[] = [
    {
      identifier: 'credit.number',
      format: (cell) => (
        <Link to={`/credits/${cell.value}`}>{cell.display_value}</Link>
      ),
    },
  ];

  useEffect(() => {
    if (!preview) {
      return;
    }

    const copy = cloneDeep(preview);

    copy.rows.map((row) => {
      row.map((cell) => {
        const replacement = replacements.find(
          (replacement) => replacement.identifier === cell.identifier
        );

        if (replacement) {
          cell.display_value = replacement.format(cell);
        }
      });
    });

    setProcessed(copy);
  }, [preview]);

  return processed;
}

export function Preview() {
  const preview = usePreview();
  const [filtered, setFiltered] = useState<Preview | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sorts, setSorts] = useState<Record<string, string>>();

  if (!preview) {
    return null;
  }

  const filter = (column: string, value: string) => {
    setFilters((current) => ({ ...current, [column]: value }));

    const copy = cloneDeep(preview);

    copy.rows = copy.rows.filter((sub) =>
      sub.some((item) => {
        if (item.id !== column) {
          return false;
        }

        if (typeof item.display_value === 'number') {
          return item.display_value
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase());
        }

        if (typeof item.display_value === 'string') {
          return item.display_value.toLowerCase().includes(value.toLowerCase());
        }

        if (typeof item.display_value === 'object') {
          return item.display_value.props.children
            .toLowerCase()
            .includes(value.toLowerCase());
        }
      })
    );

    setFiltered(copy);
  };

  const sort = (column: string) => {
    const value = sorts?.[column] === 'asc' ? 'desc' : 'asc';

    setSorts((current) => ({ ...current, [column]: value }));

    const copy = cloneDeep(preview);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    copy.rows = copy.rows.sort((first, second) => {
      const a = first.find((cell) => cell.id === column);
      const b = second.find((cell) => cell.id === column);

      if (a && b) {
        if (value === 'asc') {
          return a.display_value > b.display_value ? 1 : -1;
        } else {
          return a.display_value < b.display_value ? 1 : -1;
        }
      }
    });

    setFiltered(copy);
  };

  const data = filtered?.rows || preview.rows;

  if (preview) {
    return (
      <div id="preview-table">
        <Table>
          <Thead>
            {preview.columns.map((column, i) => (
              <Th key={i}>
                <div
                  onClick={() => sort(column.identifier)}
                  className="cursor-pointer inline-flex items-center space-x-2"
                >
                  <p>{column.display_value}</p> <BiSortAlt2 />
                </div>
              </Th>
            ))}
          </Thead>
          <Tbody>
            <Tr>
              {preview.columns.map((column, i) => (
                <Td key={i}>
                  <InputField
                    onValueChange={(value) => filter(column.identifier, value)}
                  />
                </Td>
              ))}
            </Tr>

            {data.map((row, i) => (
              <Tr key={i}>
                {row.map((cell, i) => (
                  <Td key={i}>{cell.display_value}</Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
    );
  }

  return null;
}
