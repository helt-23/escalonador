import React, { useState, useEffect } from 'react';
import '../assets/main.css';

class Processo {
  constructor(pid, tipo, prioridade) {
    this.pid = pid;
    this.tipo = tipo;
    this.prioridade = parseInt(prioridade);
    this.estado = 'pronto';
    this.tempoExecucao = Math.floor(Math.random() * 10) + 1;
  }

  getFila() {
    if (this.prioridade <= 3) return 1;
    if (this.prioridade <= 6) return 2;
    if (this.prioridade <= 9) return 3;
    return 4;
  }
}

export default function Escalonador() {
  const [processos, setProcessos] = useState([]);
  const [emExecucao, setEmExecucao] = useState(null);
  const [filas, setFilas] = useState([[], [], [], []]);
  const [formData, setFormData] = useState({ pid: '', tipo: '', prioridade: '' });
  const [intervalo, setIntervalo] = useState(null);

  const atualizarFilas = (procs) => {
    const novasFilas = [[], [], [], []];
    procs.forEach(p => {
      if (p.estado === 'pronto') novasFilas[p.getFila() - 1].push(p);
    });
    setFilas(novasFilas);
  };

  const adicionarProcesso = (e) => {
    e.preventDefault();
    const novoProcesso = new Processo(
      formData.pid,
      formData.tipo,
      formData.prioridade.match(/\d+/)[0]
    );
    const novosProcessos = [...processos, novoProcesso];
    setProcessos(novosProcessos);
    atualizarFilas(novosProcessos);
    setFormData({ pid: '', tipo: '', prioridade: '' });
  };

  const escalonar = () => {
    let novoEmExecucao = emExecucao;
    let novosProcessos = [...processos];

    if (!novoEmExecucao) {
      for (let fila of filas) {
        if (fila.length > 0) {
          novoEmExecucao = fila[0];
          novosProcessos = novosProcessos.filter(p => p.pid !== novoEmExecucao.pid);
          novoEmExecucao.estado = 'executando';
          break;
        }
      }
    }

    if (novoEmExecucao) {
      novoEmExecucao.tempoExecucao--;
      if (novoEmExecucao.tempoExecucao <= 0) {
        novosProcessos = novosProcessos.filter(p => p.pid !== novoEmExecucao.pid);
        novoEmExecucao = null;
      }
    }

    setProcessos(novosProcessos);
    setEmExecucao(novoEmExecucao);
    atualizarFilas(novosProcessos);
  };

  const iniciarEscalonamento = () => {
    if (!intervalo) {
      setIntervalo(setInterval(escalonar, 1000));
    }
  };

  const pararEscalonamento = () => {
    clearInterval(intervalo);
    setIntervalo(null);
  };

  useEffect(() => {
    return () => clearInterval(intervalo);
  }, [intervalo]);

  return (
    <div className="container">
      <div className="formulario">
        <h2>Gerenciador de Processos</h2>
        <form onSubmit={adicionarProcesso} className="form-grid">
          <div className="input-group">
            <label>PID</label>
            <input
              type="number"
              id="pid"
              placeholder="ID do Processo"
              required
              value={formData.pid}
              onChange={(e) => setFormData({ ...formData, pid: e.target.value })}
            />
          </div>
          <div className="input-group">
            <label>Tipo</label>
            <select
              id="tipo"
              required
              value={formData.tipo}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
            >
              <option value="">Selecione...</option>
              <option>Sistema</option>
              <option>Interativo</option>
              <option>Batch</option>
              <option>I/O-bound</option>
            </select>
          </div>
          <div className="input-group">
            <label>Prioridade</label>
            <select
              id="prioridade"
              required
              value={formData.prioridade}
              onChange={(e) => setFormData({ ...formData, prioridade: e.target.value })}
            >
              <option value="">Nível...</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">➕ Adicionar Processo</button>
        </form>
      </div>

      <div className="status">
        <div className="fila executando">
          <h3>▶️ Processo em Execução</h3>
          <div id="executando">
            {emExecucao ? (
              <div className="processo executando">
                <div className="processo-info">
                  <strong>PID: {emExecucao.pid}</strong>
                  <span>Tipo: {emExecucao.tipo}</span>
                  <span>Tempo: {emExecucao.tempoExecucao}s</span>
                </div>
                <span className="estado">Executando</span>
              </div>
            ) : 'Nenhum processo em execução'}
          </div>
        </div>
        <div className="fila esperando">
          <h3> Processos em Espera</h3>
          <div id="esperando">
            {processos.filter(p => p.estado === 'esperando').map(p => (
              <div key={p.pid} className="processo esperando">
                <div className="processo-info">
                  <strong>PID: {p.pid}</strong>
                  <span>Tipo: {p.tipo}</span>
                </div>
                <span className="estado">Esperando</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="controle">
        <button className="btn btn-primary" onClick={iniciarEscalonamento}>
          ▶️ Iniciar Escalonamento
        </button>
        <button className="btn btn-danger" onClick={pararEscalonamento}>
          ⏸️ Pausar Processos
        </button>
      </div>

      {[1, 2, 3, 4].map((filaNum) => (
        <div key={filaNum} className={`fila fila${filaNum}`}>
          <h3>
            {filaNum === 1 && 'Prioridade 1-3 (Alta)'}
            {filaNum === 2 && 'Prioridade 4-6 (Média)'}
            {filaNum === 3 && 'Prioridade 7-9 (Baixa)'}
            {filaNum === 4 && 'Prioridade 10 (Background)'}
          </h3>
          <div>
            {filas[filaNum - 1].map(p => (
              <div key={p.pid} className="processo">
                <div className="processo-info">
                  <strong>PID: {p.pid}</strong>
                  <span>Tipo: {p.tipo}</span>
                  <span>Prio: {p.prioridade}</span>
                </div>
                <span className="estado pronto">Pronto</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}