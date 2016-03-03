/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.docup.server;

/**
 *
 * @author elion
 * @param <E>
 */
public interface JPAService<E> {
    
    public E insert(E entity);
    public E update(E entity);
    public void remove(E description);
    
}
